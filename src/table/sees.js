const Room = require('@living-room/client-js')
const room = new Room()

const SEES_DIST = 0.5

const seesAnimal = verbose => {
  // Animal looks like:
  //
  // {
  //   name: { word: 'Simba' },
  //   type: foo,
  //   x: 0.123,
  //   y: 0.456
  // }

  Promise.all([
    _promiseSelect(`$a sees $b`),
    _promiseSelect(`$name is a $type animal at ($x, $y)`)
  ])
    .then(([oldSees, animals]) => {
      if (verbose) {
        console.log(`### ${new Date()}\n`)
        console.log('oldSees?', oldSees)
        console.log('animals?', animals)
      }

      oldSees = oldSees.map(x => _joinNames([x.a.word, x.b.word]))
      let newSees = _getSees(animals).map(_joinNames)

      oldSees = new Set(oldSees)
      newSees = new Set(newSees)

      // get and remove intersection between the two
      let intersection = []
      newSees.forEach(x => {
        if (oldSees.has(x)) {
          intersection.push(x)
        }
      })
      intersection.forEach(x => {
        oldSees.delete(x)
        newSees.delete(x)
      })

      if (verbose) {
        console.log('processed oldSees', oldSees)
        console.log('processed newSees', newSees)
        console.log()
      }

      // retract remaining olds and assert remaining news (no change to intersection)
      Array.from(oldSees)
        .map(_splitNames)
        .forEach(([a, b]) => {
          console.log(`RETRACT ${a} sees ${b}`)
          room.retract(`${a} sees ${b}`)
        })
      Array.from(newSees)
        .map(_splitNames)
        .forEach(([a, b]) => {
          console.log(`ASSERT ${a} sees ${b}`)
          room.assert(`${a} sees ${b}`)
        })
    })
    .catch(e => {
      console.log('ERROR', e)
    })
}

// helpers

const _promiseSelect = query =>
  new Promise((resolve, reject) => room.select([query]).then(resolve))

const _getSees = animals => {
  // group by name (in case of redundant names)
  let nameToAnimalsMap = new Map()

  animals.forEach(x => {
    let name = x.name.word
    if (!nameToAnimalsMap.has(name)) {
      nameToAnimalsMap.set(name, [])
    }
    nameToAnimalsMap.get(name).push(x)
  })

  let seenNames = new Set()
  let results = []

  // iterate over names finding in range and trying to avoid duplicate work
  nameToAnimalsMap.forEach((anims, name) => {
    anims.forEach(anim => {
      let name = anim.name.word
      let sees = animals.filter(
        o =>
          o.name.word !== name &&
          !seenNames.has(o.name.word) &&
          _distance(anim, o) <= SEES_DIST
      )

      seenNames.add(name)

      sees.forEach(s => {
        results.push([name, s.name.word], [s.name.word, name])
      })
    })
  })

  return results
}

const _distance = (a, b) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))

const _joinNames = x => x.join('$')
const _splitNames = x => x.split('$')

const hasAny = (arr, args) => args.some(arg => arr.indexOf(arg) !== -1)

// Main runner

if (require.main === module) {
  if (hasAny(process.argv, ['--help', '-h'])) {
    console.log('USAGE: node sees.js [-v|--verbose]')
  } else {
    let verbose = ['--verbose', '-v'].some(
      arg => process.argv.indexOf(arg) !== -1
    )
    setInterval(() => seesAnimal(verbose), 500)
  }
}

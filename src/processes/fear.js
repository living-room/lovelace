module.exports = room => {
  if (!room) {
    const Room = require('@living-room/client-js')
    room = new Room()
  }

  const animalsWeHaveSeen = new Set()

  room.on(`$name is a $type animal at ($, $) @ $`, ({ type, name }) => {
    if (animalsWeHaveSeen.has(name)) return

    let fears = {
      [type]: 'not',
      mouse: 'mildly'
    }

    const fearsByType = {
      cat: {
        dog: 'very',
        mouse: 'not'
      },
      elephant: {
        mouse: 'very'
      },
      dog: {
        cat: 'very'
      },
      mouse: {
        cat: 'very'
      }
    }

    for (let otherType in Object.assign(fears, fearsByType[type])) {
      room
        .assert(
          `${type} ${name} is ${fears[otherType]} afraid of a ${otherType}`
        )
        .then()
    }
    animalsWeHaveSeen.add(name)
  })
}

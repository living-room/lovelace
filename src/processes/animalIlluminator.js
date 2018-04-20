// This looks for animals, and adds text for them

module.exports = async room => {
  // query animals
  room.subscribe(`$name is a $ animal at ($x, $y)`, ({assertions, retractions}) => {
    retractions.forEach(({ name, x, y }) => {
      room.retract(`draw text "${name}" at (${x}, ${y})`)
    })

    assertions.forEach(({ name, x, y}) => {
      room.assert(`draw text ${name} at (${x}, ${y})`)
    })
  })

  // set up some demo data
  room.select(`$name is a $ animal at ($, $)`)
      .then(({assertions}) => {
        const names = assertions.map(animal => animal.name.word)
        if (!names.includes('Simba')) {
          await room.assert(`Simba is a cat animal at (0.5, 0.1)`)
        }
        if (!names.includes('Timon')) {
          await room.assert(`Timon is a meerkat animal at (0.4, 0.6)`)
        }
        if (!names.includes('Pumba')) {
          await room.assert(`Pumba is a warthog animal at (0.55, 0.6)`)
        }
      })
}

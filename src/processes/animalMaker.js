// Create some animals, assign how far species can see

module.exports = room => {
  if (!room) {
    const Room = require('@living-room/client-js')
    room = new Room()
  }

  room.on(
    `$ is a $species animal at ($, $) @ $`,
    `animalMaker is active`,
    async ({ species }) => {
      if ((await room.select(`${species} can see $`)).length) return
      room.assert(`${species} can see ${Math.random() / 5}`).then()
    }
  )

  // bootstrap
  room.subscribe(`animalMaker is $what`, ({ assertions, retractions }) => {
    if (assertions.length) {
      room
        .assert(`simba is a cat animal at (0.4, 0.6) @ 1`)
        .assert(`timon is a meerkat animal at (0.6, 0.6) @ 1`)
        .assert(`pumba is a warthog animal at (0.5, 0.4) @ 1`)
        .then()
    } else if (retractions.length) {
      room
        .retract(`simba is a $ animal at ($, $) @ $`)
        .retract(`timon is a $ animal at ($, $) @ $`)
        .retract(`pumba is a $ animal at ($, $) @ $`)
        .then()
    }
  })

  room.assert('animalMaker is active').then()
}

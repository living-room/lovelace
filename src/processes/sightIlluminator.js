module.exports = room => {
  if (!room) {
    const Room = require('@living-room/client-js')
    room = new Room()
  }

  // we either need local state
  // or to make halos have time steps
  // or to have on give us all assertions at once
  // or to have a notion of "before" and now
  // so it is off for now

  room.on(
    `sightIlluminator is active`,
    `$name is a $ animal at ($x, $y) @ $t`,
    `$name sees $distance`,
    ({ name, x, y }) => {
      room
        .retract(`table: draw a (255, 127, 127) halo at ($, $)`)
        .assert(`table: draw a (255, 127, 127) halo at (${x}, ${y})`)
        .then()
    }
  )
}

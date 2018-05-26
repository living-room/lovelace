// Draw animals on the table
module.exports = room => {
  if (!room) {
    const Room = require('@living-room/client-js')
    room = new Room()
  }

  room.on(`$name is a $ animal at ($x, $y) @ $`, ({ name, x, y }) => {
    room
      .retract(`table: draw label ${name} at ($, $)`)
      .assert(`table: draw label ${name} at (${x}, ${y})`)
      .then()
  })
}

// Increase a clock once a second
module.exports = room => {
  if (!room) {
    const Room = require('@living-room/client-js')()
    room = new Room()
  }

  room.on(`time is $t`, ({ t }) => {
    setTimeout(() => {
      room
        .retract(`time is ${t}`)
        .assert(`time is ${t + 1}`)
        .then()
    }, 1000)
  })

  room.assert(`time is 1`).then()
}

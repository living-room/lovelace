module.exports = room => {
  if (!room) {
    const Room = require('@living-room/client-js')()
    room = new Room()
  }

  room.on(`time is $t`, ({ t }) => {
    setTimeout(() => {
      room.retract(`time is ${t}`)
      room.assert(`time is ${t + 1}`)
    }, 1000)
  })

  setTimeout(() => {
    room.assert(`time is 1`)
  }, 1000)
}
module.exports = async room => {
  if (!room) {
    const Room = require('@living-room/client-js')
    room = new Room()
  }

  let buf = []

  room.on(
    `keyboardIlluminator is active`,
    `$mac got input event type $type with code $code and value $value @ $seq`,
    ({ code, type, value, seq }) => {
      if (code !== 4) return
      if (type !== 4) return
      const previous = `whiteboard: draw small text "${buf.join(
        ' '
      )}" at (0.05, 0.60)`
      buf[seq] = value - 458700
      const current = `whiteboard: draw small text "${buf.join(
        ' '
      )}" at (0.05, 0.60)`
      room
        .retract(previous)
        .assert(current)
        .then()
    }
  )

  room.assert(`keyboardIlluminator is active`).then()
}

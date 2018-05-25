module.exports = room => {
  if (!room) {
    const Room = require('@living-room/client-js')()
    room = new Room()
  }

  room.on(
    `$name is a $species animal at ($x, $y) @ $previous`,
    `time is $current`,
    `move is active`,
    async ({name, species, x, y, previous, current}) => {
      if (current < previous) return
      const speed = await room.select(`${name} has speed ($dx, $dy)`)
      if (speed.length === 0) return
      const {dx: {value: dx}, dy: {value: dy}} = speed[speed.length - 1]

      room.retract(`${name} is a ${species} animal at (${x}, ${y}) @ ${previous}`)
      room.assert(`${name} is a ${species} animal at (${x + dx}, ${y + dy}) @ ${current + 1}`)
    }
  )

  room.assert('move is active')
}

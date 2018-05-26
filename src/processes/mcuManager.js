// Cleans up after an MCU (which is a simple client constantly
// asserting its analog input value, without retractions).

module.exports = room => {
  if (!room) {
    const Room = require('@living-room/client-js')
    room = new Room()
  }

  room.subscribe(
    `$name has analog value $value @ $seq`,
    ({ assertions, retractions }) => {
      const latestAssertions = new Map()

      for (let assertion of assertions) {
        const { name, seq } = assertion
        const latestAssertion = latestAssertions.get(name) || assertion
        if (seq >= latestAssertion.seq) {
          latestAssertions.set(name, assertion)
        }
      }

      for (let [name, { value }] of latestAssertions) {
        room
          .retract(`"${name}" has analog value $`)
          .retract(`table: draw text $ at (0.5, 0.5)`)
          .assert(`table: draw text "${name}: ${value}" at (0.5, 0.5)`)
          .assert(`"${name}" has analog value ${value}`)
          .retract(`"${name}" has analog value $ @ $`)
          .then()
      }
    }
  )
}

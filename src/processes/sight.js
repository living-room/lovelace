// $name is a $species animal at ($x, $y)
// $species can see $distance

module.exports = room => {
  if (!room) {
    const Room = require('@living-room/client-js')
    room = new Room()
  }

  const metadata = {
    url: `https://github.com/living-room/lovelace/blob/master/src/processes/sight.js`
  }

  room.subscribe(
    `sight is active`,
    `$a is a $species animal at ($ax, $ay)`,
    `$b is a $ animal at ($bx, $by)`,
    `$species can see $distance`,
    ({ assertions, retractions }) => {
      assertions.forEach(({ a, b, ax, ay, bx, by, distance }) => {
        if (a === b) return
        const [dx, dy] = [bx - ax, by - ay]
        const seesFact = `${a} sees ${b}`

        if (Math.sqrt(dx * dx + dy * dy) < Math.sqrt(distance * distance)) {
          room.assert(seesFact).then()
        } else {
          room.retract(seesFact).then()
        }
      })
    }
  )

  room.assert('sight is active').then()
  for (let key in metadata) {
    room.assert(`sight has ${key} "${metadata[key]}"`).then()
  }
}

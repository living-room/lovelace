// Shows fear
module.exports = room => {
  if (!room) {
    const Room = require('@living-room/client-js')
    room = new Room()
  }
  const ping = require('ping')

  let em = 0.02
  let y = 1 - 2 * em
  let x = 1 - 10 * em

  const lastseen = new Map()

  // query animals
  room.subscribe(
    `networkIlluminator is active`,
    `$mac got ip $ip`,
    ({ assertions, retractions }) => {
      assertions.forEach(({ mac, ip }) => {
        lastseen.set(mac, { mac, ip, x, y, date: Date.now() })
        const fact = `${mac} => ${ip}`
        const drawfact = `whiteboard: draw small text "${fact}" at (${x}, ${y})`
        room.assert(drawfact)
        y -= em
      })
      retractions.forEach(({ mac, ip }) => {
        if (!lastseen.has(mac)) return
        const { x, y } = lastseen.get(mac)
        const fact = `${mac} => ${ip}`
        const drawfact = `whiteboard: draw small text "${fact}" at (${x}, ${y})`
        console.log(`retract: ${drawfact}`)
        lastseen.delete(mac)
        room.retract(drawfact).then()
      })
    }
  )

  return {
    delay: 5000,
    step: () => {
      for (let [mac, { ip, x, y }] of lastseen.entries()) {
        ping.sys.probe(ip, isAlive => {
          if (!isAlive) {
            const fact = `"${mac}" got ip "${ip}"`
            return room.retract(fact).then()
          }
          lastseen.set(mac, { mac, ip, x, y, date: Date.now() })
        })
      }
    }
  }
}

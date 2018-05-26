// This looks for animals, and adds text for them
//    `$name is a $ animal at ($x, $y)`,

module.exports = async room => {
  room.subscribe(
    `hueIlluminator is active`,
    `glow$ has hueIndex $ at ($x, $y)`,
    ({ assertions, retractions }) => {
      retractions.forEach(({ x, y }) => {
        room
          .retract(
            `table: draw a (0, 255, 255) halo around (${x}, ${y}) with radius 0.05`
          )
          .then(console.dir)
      })
      assertions.forEach(({ x, y }) => {
        room
          .assert(
            `table: draw a (0, 255, 255) halo around (${x}, ${y}) with radius 0.05`
          )
          .then(console.dir)
      })
    }
  )

  room.assert(`hueIlluminator is active`).then()
}

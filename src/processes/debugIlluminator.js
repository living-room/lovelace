// Label displays, processes, and other debug information
module.exports = async room => {
  const em = 0.05
  const right_x = 1 - 5 * em
  const activeProcesses = new Map()

  const facts = [
    `draw label display at (${em}, ${em})`,
    `table: draw label table at (${em}, ${em + em})`,
    `whiteboard: draw label whiteboard at (${em}, ${em + em})`,
    `whiteboard: draw text "active processes" at (${right_x}, ${em})`
  ]

  room.subscribe(`$name is active`, ({ assertions, retractions }) => {
    retractions.forEach(({ name }) => {
      const index =
        (activeProcesses.get(name) && activeProcesses.get(name).index) ||
        activeProcesses.size + 1
      activeProcesses.set(name, { index, active: false })
    })

    assertions.forEach(({ name }) => {
      const index =
        (activeProcesses.get(name) && activeProcesses.get(name).index) ||
        activeProcesses.size + 1
      activeProcesses.set(name, { index, active: true })
    })

    if (
      activeProcesses.has('debugIlluminator') &&
      !activeProcesses.get('debugIlluminator').active
    ) {
      facts.forEach(fact => room.retract(fact))
      Array.from(activeProcesses.entries()).forEach(([name, { index }]) => {
        const y = (2 + index + 1) * em
        const fact = `whiteboard: draw label ${name} at (${right_x}, ${y})`
        room.retract(fact)
      })
    }

    if (
      activeProcesses.has('debugIlluminator') &&
      activeProcesses.get('debugIlluminator').active
    ) {
      facts.forEach(fact => room.assert(fact))
      Array.from(activeProcesses.entries()).forEach(
        ([name, { index, active }]) => {
          const y = (2 + index + 1) * em
          const fact = `whiteboard: draw label ${name} at (${right_x}, ${y})`
          if (active) {
            room.assert(fact)
          } else {
            room.retract(fact)
          }
        }
      )
    }
  })

  room.assert('debugIlluminator is active')
}

module.exports = room => {
  if (!room) {
    const Room = require('@living-room/client-js')
    room = new Room()
  }

  // If an animal intersects with a boundingBox wall "bounce" the animal in the
  // opposite direction
  const bounceOffWall = function (changes) {
    for (i of changes.assertions) {
      if (i.x <= i.x0 || i.x >= i.w || i.y <= i.y0 || i.y >= i.h) {
        room.retract(`${i.name} has speed (${i.dx}, ${i.dy})`)
        room.assert(`${i.name} has speed (${-i.dx}, ${-i.dy})`)
      }
    }
  }

  // Query the db for all animals (any name, any type, any position) if there is
  // a boundingBox of any size at any postion that is active
  //
  // Note: A feature of the subscribe function is that it uses a constraint
  // solver to satisfy the placeholders, e.g. $x and $y, before calling the
  // callback function.
  room.subscribe(
    `$name is a $type animal at ($x, $y) @ $frame`,
    `$name has speed ($dx, $dy)`,
    `boundingBox is $w x $h at ($x0, $y0)`,
    `move is active`,
    `boundingBox is active`,
    bounceOffWall
  )

  room.assert(`boundingBox is active`)
}

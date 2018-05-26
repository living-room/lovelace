// This is a demo of subscribing to a server query.

// Draw a word
//  `draw label $name at ($x, $y)`
//  `draw label Timon at (0.3, 0.3)`

// Draw a sentence
//  `draw text $text at ($x, $y)`
//  `draw text "timon is cool" at (0.8, 0.8)`

// Draw a tiny sentence
//  `draw small text $text at ($x, $y)`
//  `draw small text "timon is cool" at (0.8, 0.8)`

// Drawing a line
//  `draw a ($r, $g, $b) line from ($x, $y) to ($xx, $yy)`
//  `draw a (255, 255, 0) line from (0.3, 0.3) to (0.5, 0.5)`

// Drawing a circle:
//  `$name is a ($r, $g, $b) circle at ($x, $y) with radius $radius`
//  `draw a (255, 12, 123) circle at (0.5, 0.6) with radius 0.1`

// Drawing a halo:
//  `draw a ($r, $g, $b) halo around ($x, $y) with radius $radius`
//  `draw a (255, 12, 123) halo around (0.5, 0.6) with radius 0.1`

const hostname = location.hostname
const pathArray = location.pathname.split('/')
const htmlpath = pathArray[pathArray.length - 1]
const namespace = htmlpath.split('.')[0]

const room = new LivingRoom(`http://${hostname}:3000`)
const context = canvas.getContext('2d')

let labels = new Map()
let texts = new Map()
let circles = new Map()
let halos = new Map()
let lines = new Map()

const normToCoord = (n, s = canvas.height) => (n < -1 || n > 1 ? n : n * s)

const updateLabel = ({ assertions, retractions }) => {
  retractions.forEach(label => labels.delete(JSON.stringify(label)))

  assertions.forEach(label => {
    labels.set(JSON.stringify(label), {
      label: label.name,
      x: label.x,
      y: label.y
    })
  })

  scheduleDraw()
}

const updateText = ({ assertions, retractions }) => {
  retractions.forEach(text => texts.delete(JSON.stringify(text)))

  assertions.forEach(text => {
    texts.set(JSON.stringify(text), {
      size: text.size,
      angle: text.angle,
      text: text.text,
      x: text.x,
      y: text.y
    })
  })
  scheduleDraw()
}

const updateLine = ({ retractions, assertions }) => {
  retractions.forEach(line => lines.delete(JSON.stringify(line)))

  assertions.forEach(line => {
    lines.set(JSON.stringify(line), {
      r: line.r,
      g: line.g,
      b: line.b,
      x: line.x,
      y: line.y,
      xx: line.xx,
      yy: line.yy
    })
  })

  scheduleDraw()
}

const updateCircle = ({ assertions, retractions }) => {
  retractions.forEach(circle => circles.delete(JSON.stringify(circle)))

  assertions.forEach(circle => {
    circles.set(JSON.stringify(circle), {
      x: circle.x,
      y: circle.y,
      r: circle.r,
      g: circle.g,
      b: circle.b,
      radius: circle.radius
    })
  })

  scheduleDraw()
}

const updateHalo = ({ assertions, retractions }) => {
  retractions.forEach(halo => halos.delete(JSON.stringify(halo)))

  assertions.forEach(halo => {
    halos.set(JSON.stringify(halo), {
      x: halo.x,
      y: halo.y,
      r: halo.r,
      g: halo.g,
      b: halo.b,
      radius: halo.radius
    })
  })

  scheduleDraw()
}

// Query labels
room.subscribe(`draw label $name at ($x, $y)`, updateLabel)
room.subscribe(`${namespace}: draw label $name at ($x, $y)`, updateLabel)

// Query text
room.subscribe(`draw text $text at ($x, $y)`, updateText)
room.subscribe(`${namespace}: draw text $text at ($x, $y)`, updateText)

// Query small text
room.subscribe(`draw $size text $text at ($x, $y)`, updateText)
room.subscribe(`${namespace}: draw $size text $text at ($x, $y)`, updateText)

room.subscribe(`draw $size text $text at ($x, $y) at angle $angle`, updateText)
room.subscribe(
  `${namespace}: draw $size text $text at ($x, $y) at angle $angle`,
  updateText
)

// Query lines
room.subscribe(
  `draw a ($r, $g, $b) line from ($x, $y) to ($xx, $yy)`,
  updateLine
)
room.subscribe(
  `${namespace}: draw a ($r, $g, $b) line from ($x, $y) to ($xx, $yy)`,
  updateLine
)
// Query circles
room.subscribe(
  `draw a ($r, $g, $b) circle at ($x, $y) with radius $radius`,
  updateCircle
)
room.subscribe(
  `${namespace}: draw a ($r, $g, $b) circle at ($x, $y) with radius $radius`,
  updateCircle
)
// Query halos
room.subscribe(
  `draw a ($r, $g, $b) halo around ($x, $y) with radius $radius`,
  updateHalo
)
room.subscribe(
  `${namespace}: draw a ($r, $g, $b) halo around ($x, $y) with radius $radius`,
  updateHalo
)

async function draw (time) {
  // if the window is resized, change the canvas to fill the window
  canvas.width = canvas.clientWidth * window.devicePixelRatio
  canvas.height = canvas.clientHeight * window.devicePixelRatio

  // clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height)

  context.fillStyle = '#fff'
  context.font = `${40 * window.devicePixelRatio}px sans-serif`

  labels.forEach(({ label, x, y }) => {
    context.save()
    context.fillText(label, normToCoord(x, canvas.width), normToCoord(y))
    context.restore()
  })

  texts.forEach(({ text, x, y, size, angle }) => {
    context.save()
    context.fillStyle = '#9999ff'
    if (size === 'small') {
      context.font = `${20 * window.devicePixelRatio}px sans-serif`
    }
    if (typeof angle !== 'undefined') {
      context.translate(normToCoord(x, canvas.width), normToCoord(y))
      context.rotate(-angle) // counterclockwise
      context.translate(-normToCoord(x, canvas.width), -normToCoord(y))
    }
    context.fillText(text, normToCoord(x, canvas.width), normToCoord(y))
    context.restore()
  })

  circles.forEach(({ x, y, r, g, b, radius }) => {
    context.save()
    context.strokeStyle = `rgb(${r},${g},${b})`
    context.beginPath()
    context.ellipse(
      normToCoord(x, canvas.width),
      normToCoord(y),
      normToCoord(radius),
      normToCoord(radius),
      0,
      0,
      2 * Math.PI
    )
    context.stroke()
    context.restore()
  })

  halos.forEach(({ x, y, r, g, b, radius }) => {
    context.save()
    context.strokeStyle = `rgb(${r},${g},${b})`
    context.fillStyle = `rgb(${r},${g},${b},0)`
    context.beginPath()
    context.ellipse(
      normToCoord(x, canvas.width),
      normToCoord(y),
      normToCoord(radius),
      normToCoord(radius),
      0,
      0,
      2 * Math.PI
    )
    context.stroke()
    context.restore()
  })

  lines.forEach(({ x, y, xx, yy, r, g, b }) => {
    context.save()
    context.strokeStyle = `rgb(${r},${g},${b})`
    context.beginPath()
    context.moveTo(x * canvas.width, y * canvas.height)
    context.lineTo(xx * canvas.width, yy * canvas.height)
    context.stroke()
    context.restore()
  })
}

let drawAnimationFrame = null
function scheduleDraw () {
  if (drawAnimationFrame) return
  drawAnimationFrame = requestAnimationFrame(() => {
    drawAnimationFrame = null
    draw()
  })
}

window.addEventListener('resize', draw)

draw()

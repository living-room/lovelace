const keymap = {
  1: 'esc',
  2: '1',
  3: '2',
  4: '3',
  5: '4',
  6: '5',
  7: '6',
  8: '7',
  9: '8',
  10: '9',
  11: '0',
  12: 'minus',
  13: 'equal',
  14: 'backspace',
  15: 'tab',
  16: 'q',
  17: 'w',
  18: 'e',
  19: 'r',
  20: 't',
  21: 'y',
  22: 'u',
  23: 'i',
  24: 'o',
  25: 'p',
  26: 'leftbrace',
  27: 'rightbrace',
  28: 'enter',
  29: 'leftctrl',
  30: 'a',
  31: 's',
  32: 'd',
  33: 'f',
  34: 'g',
  35: 'h',
  36: 'j',
  37: 'k',
  38: 'l',
  39: 'semicolon',
  40: 'apostrophe',
  41: 'grave',
  42: 'leftshift',
  43: 'backslash',
  44: 'z',
  45: 'x',
  46: 'c',
  47: 'v',
  48: 'b',
  49: 'n',
  50: 'm',
  51: ',',
  52: '.',
  53: '/',
  54: 'rightshift',
  55: 'kpasterisk',
  56: 'leftalt',
  57: ' ',
  58: 'capslock',
  59: 'f1',
  60: 'f2',
  61: 'f3',
  62: 'f4',
  63: 'f5',
  64: 'f6',
  65: 'f7',
  66: 'f8',
  67: 'f9',
  68: 'f10',
  69: 'numlock',
  70: 'scrolllock',
  71: 'kp7',
  72: 'kp8',
  73: 'kp9',
  74: 'kpminus',
  75: 'kp4',
  76: 'kp5',
  77: 'kp6',
  78: 'kpplus',
  79: 'kp1',
  80: 'kp2',
  81: 'kp3',
  82: 'kp0',
  83: 'kpdot'
}

module.exports = async room => {
  if (!room) {
    const Room = require('@living-room/client-js')
    room = new Room()
  }

  let buf = []

  let latestX = 0.5
  let latestY = 0.5
  let latestAngle = 0
  room.on(
    `keyboardTerminal is active`,
    `keyboard $ is at ($x, $y) angle $angle`,
    ({ x, y, angle }) => {
      latestX = x
      latestY = y
      latestAngle = -angle / 180 * Math.PI
    }
  )

  room.on(
    `keyboardTerminal is active`,
    `$mac got input event type $type with code $code and value $value @ $seq`,
    ({ mac, code, type, value, seq }) => {
      if (type !== 1) return // type 1 = EV_KEY event
      if (value !== 1) return // value 1 = Key-down event

      // Should we retract here?
      room
        .retract(
          `${mac} got input event type ${type} with code ${code} and value ${value} @ ${seq}`
        )
        .then()

      room.retract(`table: draw small text "${buf.join('')}" at ($, $)`).then()
      console.log(keymap[code])
      if (keymap[code] === 'enter') {
        console.log(buf.join(''))
        room.assert(buf.join('')).then()
        buf = []
      } else if (keymap[code] === 'backspace') {
        buf.pop()
      } else {
        buf.push(keymap[code])
      }
      room
        .assert(
          `table: draw small text "${buf.join(
            ''
          )}" at (${latestX}, ${latestY}) at angle ${latestAngle}`
        )
        .then()
    }
  )

  room.assert(`keyboardTerminal is active`).then()
}

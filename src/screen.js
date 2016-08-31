const canvas = document.querySelector('canvas')

const pointerIsLocked = function () {
  var element = document.pointerLockElement || document.mozPointerLockElement
  return element === canvas
}

const lockPointer = function () {
  canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock
  document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock
  canvas.requestPointerLock()
}

canvas.onclick = function() {
  lockPointer()
}

var keys = []

document.onkeydown = function (event) {
  if (pointerIsLocked()) {
    if (keys.indexOf(event.code) === -1) {
      keys.push(event.code)
    }
  }
}

document.onkeyup = function (event) {
  if (pointerIsLocked()) {
    if (keys.indexOf(event.code) > -1) {
      keys.splice(keys.indexOf(event.code), 1)
    }
  }
}

const iskeypressed = function (keyCode) {
  if (pointerIsLocked()) {
    return (keys.indexOf(keyCode) > -1)
  } else {
    keys = []
  }
}

const onmousemove = function (callback) {
  document.onmousemove = function (event) {
    if (pointerIsLocked()) {
      callback(event)
    }
  }
}

const onclick = function (callback) {
  document.onclick = function (event) {
    if (pointerIsLocked()) {
      callback(event)
    } else {
      lockPointer()
    }
  }
}

const onwheel = function (callback) {
  document.onwheel = function (event) {
    if (pointerIsLocked()) {
      callback(event)
    }
    event.preventDefault()
  }
}

module.exports = {
  canvas: canvas,
  pointerIsLocked: pointerIsLocked,
  lockPointer: lockPointer,
  iskeypressed: iskeypressed,
  onmousemove: onmousemove,
  onclick: onclick,
  onwheel: onwheel
}

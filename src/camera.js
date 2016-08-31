const glm = require('gl-matrix')

var position = { x: 0, y: 0, z: 0 }
var rotation = { x: 0, y: 0, z: 0 }

const getPosition = (a) => (!a?position:[position.x, position.y, position.z])
const setPosition = (x, y, z) => position = { x, y, z }

const getRotation = () => rotation
const setRotation = (x, y, z) => rotation = { x, y, z }

const move = (x, y, z) => {
  var dx = x, dy = y, dz = z

  if (dx !== 0) dx /= dx
  if (dy !== 0) dy /= dy
  if (dz !== 0) dz /= dz

  var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2)) || 1

  position.x += dx / distance * x
  position.y += dy / distance * y
  position.z += dz / distance * z
}

const rotate = (x, y, z) => {
  rotation.x += x
  rotation.y += y
  rotation.z += z
}

const viewMatrix = () => {
  var matrix = new Float32Array(16)
  glm.mat4.identity(matrix)
  glm.mat4.rotate(matrix, matrix, glm.glMatrix.toRadian(getRotation().x), [1, 0, 0])
  glm.mat4.rotate(matrix, matrix, glm.glMatrix.toRadian(getRotation().y), [0, 1, 0])
  glm.mat4.rotate(matrix, matrix, glm.glMatrix.toRadian(getRotation().z), [0, 0, 1])
  glm.mat4.translate(matrix, matrix, [-getPosition().x, -getPosition().y, -getPosition().z])
  return matrix
}

module.exports = {getPosition, setPosition, getRotation, setRotation, move, rotate, viewMatrix}

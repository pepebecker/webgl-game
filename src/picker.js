const glm = require('gl-matrix')
const ray = require('./ray.js')

const toNormailizedDeviceSpace = (x, y) => {
  var w = window.innerWidth
  var h = window.innerHeight
  let normalizedDeviceCoords = glm.vec3.create()
  normalizedDeviceCoords[0] = x / w * 2 - 1
  normalizedDeviceCoords[1] = y / h * 2 - 1
  normalizedDeviceCoords[2] = -1
  return normalizedDeviceCoords
}

const toClipSpace = (normalizedDeviceCoords) => {
  let clipCoords = glm.vec4.create()
  clipCoords[0] = normalizedDeviceCoords[0]
  clipCoords[1] = normalizedDeviceCoords[1]
  clipCoords[2] = normalizedDeviceCoords[2]
  clipCoords[3] = -normalizedDeviceCoords[2]
  return clipCoords
}

const toEyeSpace = (clipCoords) => {
  let eyeCoords = glm.vec4.create()
  let invertedProjection = glm.mat4.create()
  glm.mat4.invert(invertedProjection, projection())
  glm.mat4.multiply(eyeCoords, invertedProjection, clipCoords)
  eyeCoords[3] = 0
  return eyeCoords
}

const toWorldSpace = (eyeCoords) => {
  let worldCoords = glm.vec4.create()
  let invertedView = glm.mat4.create()
  glm.mat4.invert(invertedView, camera.viewMatrix())
  glm.mat4.multiply(worldCoords, invertedView, eyeCoords)
  return worldCoords
}

const screenToWorldVector = (x, y) => {
  let normalizedCoords = toNormailizedDeviceSpace(x, y)
  let clipCoords       = toClipSpace(normalizedCoords)
  let eyeCoords        = toEyeSpace(clipCoords)
  let worldCoords      = toWorldSpace(eyeCoords)

  let worldVector = glm.vec3.create()
  worldVector[0] = worldCoords[0]
  worldVector[1] = worldCoords[1]
  worldVector[2] = worldCoords[2]
  glm.vec3.normalize(worldVector, worldVector)
  return worldVector
}

const screenToWorldRay = (camPos, x, y, length) => {
  let worldVector = screenToWorldVector(x, y)

  let worldRay = ray.create(camPos, worldVector, length)

  return worldRay
}

module.exports = { screenToWorldVector, screenToWorldRay }

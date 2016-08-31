const glm = require('gl-matrix')

module.exports = () => {
  var matrix = new Float32Array(16)
  var fovy = glm.glMatrix.toRadian(45)
  var aspect = window.innerWidth / window.innerHeight
  var near = 0.1
  var far = 1000.0
  glm.mat4.perspective(matrix, fovy, aspect, near, far)
  return matrix
}

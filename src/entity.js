const glm = require('gl-matrix')
const ray = require('./projection.js')

module.exports = (regl) => (mesh, shader, texture, camera, position, rotation, scale) => {
  var color = [1, 1, 1, 1]
  var tiling = [1, 1]

  const getFlippedUVs = () => {
    var uvs = []
    for (let i = 0; i < mesh.textures.length; i ++) {
      if (i % 2 === 0) {
        uvs.push(mesh.textures[i])
      } else {
        uvs.push(1 - mesh.textures[i])
      }
    }
    return uvs
  }

  const getPosition = () => position
  const setPosition = (x, y, z) => position = { x, y, z }

  const getColor = () => color
  const setColor = (r, g, b, a) => color = [r, g, b, a]

  const getTexture = () => texture
  const setTexture = (value) => texture = texture

  const getTiling = () => tiling
  const setTiling = (x, y) => tiling = [x, y]

  const getTransform = () => {
    var matrix = new Float32Array(16)
    glm.mat4.identity(matrix)
    glm.mat4.translate(matrix, matrix, [position.x, position.y, position.z])
    glm.mat4.rotate(matrix, matrix, glm.glMatrix.toRadian(rotation.x), [1, 0, 0])
    glm.mat4.rotate(matrix, matrix, glm.glMatrix.toRadian(rotation.y), [0, 1, 0])
    glm.mat4.rotate(matrix, matrix, glm.glMatrix.toRadian(rotation.z), [0, 0, 1])
    glm.mat4.scale(matrix, matrix, [scale, scale, scale])
    return matrix
  }

  const draw = regl({
    frag: shader.fragment,
    vert: shader.vertex,
    attributes: {
      position: mesh.vertices,
      uv: getFlippedUVs
    },
    elements: mesh.indices,
    uniforms: {
      transform: getTransform,
      view: camera.viewMatrix,
      projection: projection,
      ambientlight: [.2, .2, .2],
      light_pos: [5, 3, 5],
      light_color: [.5, .5, 0],
      light_radius: 2,
      light_intensity: 2,
      sampler: getTexture,
      color: getColor,
      tiling: getTiling
    },
    cull: {
      enable: true,
      face: 'back'
    }
  })
  return { getPosition, setPosition, getColor, setColor, getTiling, setTiling, draw }
}

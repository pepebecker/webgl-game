window.regl         = require('regl')()
window.glm          = require('gl-matrix')
window.obj          = require('webgl-obj-loader')

// My Modules
window.screen       = require('./screen.js')
window.projection   = require('./projection.js')
window.camera       = require('./camera.js')
window.ray          = require('./ray.js')
window.picker       = require('./picker.js')
window.createEntity = require('./entity.js')(regl)
window.createShader = require('./shader.js')

const width  = 11
const height = 5
const length = 11

const map = [...Array(width)].map(x => [...Array(height)].map( x => Array(length)))

let zoom = 10

let player

var cubeModel
var cubeShader
var cubeTexture

for (let x = 0; x < width; x++) {
  for (let y = 0; y < height; y++) {
    for (let z = 0; z < length; z++) {
      var type = 0

      if (x === 7 && y === 1 && z === 5) type = 1

      if (x === 3 && y === 1 && z === 1) type = 1

      if (x === 2 && y === 1 && z === 1) type = 1

      if (x === 2 && y === 2 && z === 1) type = 1

      if (x === 2 && y === 1 && z === 2) type = 1

      if (x === 5 && y === 1 && z === 5) type = 2

      if (x === 2 && y === 1 && z === 7) type = 3

      if (x === 8 && y === 1 && z === 7) type = 3

      if (x === 9 && y === 1 && z === 7) type = 3

      map[x][y][z] = type
    }
  }
}

require('resl')({
  manifest: {
    atlas: {
      type: 'image',
      src: 'textures/Atlas.png',
      parser: (data) => regl.texture({
        data: data,
        mag: 'linear',
        min: 'linear',
        wrapS: 'repeat',
        wrapT: 'repeat'
      })
    },
    cubeObj: {
    	type: "text",
    	src: 'models/cube.obj',
    	parser: (data) => new obj.Mesh(data)
    },
    entityShader: {
      type: "text",
      src: 'shaders/entity.glsl',
      parser: (data) => createShader(data)
    },
    lampObj: {
      type: "text",
      src: 'models/Lamp.obj',
      parser: (data) => new obj.Mesh(data)
    },
    lampTex: {
      type: 'image',
      src: 'textures/Lamp.png',
      parser: (data) => regl.texture({
        data: data,
        mag: 'linear',
        min: 'linear'
      })
    },
    planeObj: {
      type: "text",
      src: 'models/plane.obj',
      parser: (data) => new obj.Mesh(data)
    },
    planeTex: {
      type: 'image',
      src: 'textures/Mud.png',
      parser: (data) => regl.texture({
        data: data,
        mag: 'linear',
        min: 'linear',
        wrapS: 'repeat',
        wrapT: 'repeat'
      })
    },
    treeObj: {
      type: "text",
      src: 'models/Tree.obj',
      parser: (data) => new obj.Mesh(data)
    },
    treeTex: {
      type: 'image',
      src: 'textures/Tree.png',
      parser: (data) => regl.texture({
        data: data,
        mag: 'linear',
        min: 'linear'
      })
    },
  },
  onDone: ({atlas, cubeObj, entityShader, planeObj, planeTex, lampObj, lampTex, treeObj, treeTex}) => {
    window.entities = []

    cubeModel = cubeObj
    cubeTexture = atlas
    cubeShader = entityShader

    camera.setPosition(width / 2, 5, length * 2)
    camera.setRotation(10, 0, 0)

    { // Creating the ground plane
      const position = { x: width / 2, y: .5, z: length / 2 }
      const rotation = { x: 0, y: 0, z: 0 }
      const scale = 15
      const plane = createEntity(planeObj, entityShader, planeTex, camera, position, rotation, scale)
      plane.setTiling(6, 6)
      entities.push(plane)
    }

    { // Creating the Player
      const position = { x: 5, y: 1, z: 10 }
      const rotation = { x: 0, y: 0, z: 0 }
      const scale = 1
      player = createEntity(cubeObj, entityShader, treeTex, camera, position, rotation, scale)
      player.setColor(100, 0, 0, .5)
      entities.push(player)
    }

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        for (let z = 0; z < length; z++) {
          var type = map[x][y][z]
          if (type > 0) {
            let model = cubeObj
            let shader = entityShader
            let texture = atlas
            let scale = 1
            const position = { x: x, y: y, z: z }
            const rotation = { x: 0, y: 0, z: 0}

            if (type === 2) {
              model = lampObj
              texture = lampTex
              position.y -= 0.5
              scale = .2
            }

            if (type === 3) {
              model = treeObj
              texture = treeTex
              position.y -= .5
            }

            var entity = createEntity(model, shader, texture, camera, position, rotation, scale)
            entities.push(entity)
          }
        }
      }
    }

    regl.frame(() => {
      regl.clear({
        color: [.2, .2, .2, 255],
        depth: 1
      })

      {
        var rotation = camera.getRotation()

        var input = { x: 0, y: 0, z: 0 }

        if (screen.iskeypressed('ArrowRight'))  input.x += 0.05
        if (screen.iskeypressed('ArrowLeft'))   input.x -= 0.05
        if (screen.iskeypressed('Space'))       input.y += 0.05
        if (screen.iskeypressed('ShiftLeft'))   input.y -= 0.05
        if (screen.iskeypressed('ShiftRight'))  input.y -= 0.05
        if (screen.iskeypressed('ArrowUp'))     input.z -= 0.05
        if (screen.iskeypressed('ArrowDown'))   input.z += 0.05

        var movement = { x: 0, y: 0, z: 0 }

        movement.x += input.x * Math.sin(glm.glMatrix.toRadian(rotation.y + 90));
        movement.z -= input.x * Math.cos(glm.glMatrix.toRadian(rotation.y + 90));

        movement.y = input.y;

        movement.x -= input.z * Math.sin(glm.glMatrix.toRadian(rotation.y));
        movement.z += input.z * Math.cos(glm.glMatrix.toRadian(rotation.y));

        camera.move(movement.x, movement.y, movement.z)
      }

      {
        let screenX = window.innerWidth / 2
        let screenY = window.innerHeight / 2

        let camPos = [
          camera.getPosition().x,
          camera.getPosition().y,
          camera.getPosition().z
        ]

        let worldRay = picker.screenToWorldRay(camPos, screenX, screenY, 20)

        let pos = {
          x: Math.round(worldRay.getOrigin()[0] + worldRay.getPoint(zoom)[0]),
          y: Math.round(worldRay.getOrigin()[1] + worldRay.getPoint(zoom)[1]),
          z: Math.round(worldRay.getOrigin()[2] + worldRay.getPoint(zoom)[2])
        }

        player.setPosition(pos.x, pos.y, pos.z)
      }

      for (let i = 0; i < entities.length; i++) {
        entities[i].draw()
      }
    })
  }
})

screen.onmousemove((event) => {
  camera.rotate(event.movementY * 0.1, event.movementX * 0.1, 0)
})

screen.onwheel((event) => {
  zoom += event.deltaY * 0.05
  if (zoom < 5) zoom = 5
  if (zoom > 20) zoom = 20
})

screen.onclick((event) => {

  let screenX = window.innerWidth / 2
  let screenY = window.innerHeight / 2

  let camPos = [
    camera.getPosition().x,
    camera.getPosition().y,
    camera.getPosition().z
  ]

  let worldRay = picker.screenToWorldRay(camPos, screenX, screenY, 20)

  let pos = {
    x: Math.round(worldRay.getOrigin()[0] + worldRay.getPoint(zoom)[0]),
    y: Math.round(worldRay.getOrigin()[1] + worldRay.getPoint(zoom)[1]),
    z: Math.round(worldRay.getOrigin()[2] + worldRay.getPoint(zoom)[2])
  }


  const rotation = { x: 0, y: 0, z: 0}
  let scale = 1
  var entity = createEntity(cubeModel, cubeShader, cubeTexture, camera, pos, rotation, scale)
  entities.push(entity)
})

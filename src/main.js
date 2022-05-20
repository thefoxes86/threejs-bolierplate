import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import vertex from './shader/vertex.glsl'
import fragment from './shader/fragment.glsl'

export default class Sketch {
  constructor(options) {
    // declare all the variables here
    this.scene = new THREE.Scene()

    // Container will be passed from class init
    this.container = options.dom
    this.time = 0

    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(this.width, this.height)

    this.container.appendChild(this.renderer.domElement)

    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      10,
      2000
    )

    this.cameraZ = 500

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    this.camera.position.z = this.cameraZ

    // The FOV is the angle in radius between the camera and the screen. So you can set dimension of the plane wih real viewport pixels
    this.camera.fov =
      2 * Math.atan(this.height / 2 / this.cameraZ) * (180 / Math.PI)

    // Call all the mehod to init the sketch
    this.resize()
    this.onResize()
    this.addMesh()
    this.render()
  }

  addMesh() {
    // Method to add a new Mesh with Shader Material
    // Here you can pass the dimension with pixel of the plane
    this.geometry = new THREE.PlaneBufferGeometry(300, 200, 10, 10)

    this.material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        texture: { value: null },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.scene.add(this.mesh)
  }

  resize() {
    // Scene will be resized when the window is resized
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight
    this.camera.aspect = this.width / this.height
    this.renderer.setSize(this.width, this.height)
    this.camera.updateProjectionMatrix()
  }

  onResize() {
    window.addEventListener('resize', this.resize.bind(this))
  }

  render() {
    this.time++

    this.mesh.rotation.x = this.time / 2000
    this.mesh.rotation.y = this.time / 1000

    this.renderer.render(this.scene, this.camera)
    window.requestAnimationFrame(this.render.bind(this))
  }
}

// Invoke the class Sketch passing the elemnt to put in the canvas
new Sketch({
  dom: document.getElementById('container'),
})

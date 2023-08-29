// Alumno: Miguel Carracedo Rodríguez
// Alumno: Pedro Padilla Reyes


// Clases de la biblioteca

import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'
import { TrackballControls } from '../libs/TrackballControls.js'

// Clases de mi proyecto

import { Partida } from './Partida.js'
import { Menu } from './Menu.js'

class Tetris extends THREE.Scene {
	static COLORFONDO = 0x111111
	static debug = false  // Para poder controlar la camara

	constructor(myCanvas) {
		super()
		this.background = new THREE.Color(Tetris.COLORFONDO)

		this.renderer = this.createRenderer(myCanvas)
		
		this.createLights()

		this.createCamera()

		this.menuPrincipal = new Menu()
		this.add(this.menuPrincipal)

		this.boton = this.menuPrincipal.getBoton()

		this.botonSeleccionado = null
	}

	// Crea la camara mirando a (0, 0, 0)
	createCamera() {
		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
		
		this.camera.position.set(0, 30, 50)
		
		var look = new THREE.Vector3(0, -5, 0)
		this.camera.lookAt(look)
		this.add(this.camera)

		
		this.cameraControl = new TrackballControls(this.camera, this.renderer.domElement)
		
		this.cameraControl.rotateSpeed = 5
		this.cameraControl.zoomSpeed = -2
		this.cameraControl.panSpeed = 0.5
		
		this.cameraControl.target = look
	}

	// Crea 2 luces, una ambiental, y otra focal que por defecto está delante del tablero (para que lo veamos) y se puede mover
	createLights() {
		var ambientLight = new THREE.AmbientLight(0xccddee, 0.35)
		
		this.add(ambientLight)

		this.spotLight = new THREE.SpotLight(0xffffff, 1)
		this.spotLight.position.set(60, 60, 40)
		this.add(this.spotLight)
	}

	createRenderer(myCanvas) {
		var renderer = new THREE.WebGLRenderer()

		renderer.setClearColor(0xFFFFFF, 1.0)

		renderer.setSize(window.innerWidth, window.innerHeight)

		$(myCanvas).append(renderer.domElement)

		return renderer
	}

	getCamera() {
		return this.camera
	}

	setCameraAspect(ratio) {
		this.camera.aspect = ratio
		
		this.camera.updateProjectionMatrix()
	}

	onWindowResize() {
		this.setCameraAspect(window.innerWidth / window.innerHeight)

		this.renderer.setSize(window.innerWidth, window.innerHeight)
	}

	moveLight(direction){
		if (direction == 'FRONT' && this.spotLight.position.z < 150){
			this.spotLight.position.z++
		}
		else if( direction == 'BEHIND' && this.spotLight.position.z > -60){
			this.spotLight.position.z--
		}
	}

	onKeyDown(e) {
		if (this.partida){
			let codigo = e.which || e.keyCode

			if (codigo === 37){
				this.partida.procesarBoton('LEFT')
			}
			else if (codigo === 39){
				this.partida.procesarBoton('RIGHT')
			}
			else if (codigo === 65){
				this.moveLight('FRONT')
			}
			else if (codigo === 68){
				this.moveLight('BEHIND')
			}
		}
	}

	onMouseMove(e) {
		if(this.boton){	
			let mouse = new THREE.Vector2()
			mouse.x = (e.clientX / window.innerWidth) * 2 - 1
			mouse.y = 1 - 2 * (e.clientY / window.innerHeight)

			let raycaster = new THREE.Raycaster()
			raycaster.setFromCamera(mouse, this.camera)

			let objSeleccionados = raycaster.intersectObject(this.boton, true)

			if(objSeleccionados.length > 0) {
				let objSeleccionado = objSeleccionados[0].object.userData.parent
				objSeleccionado.cambiarSeleccion(true)

				this.botonSeleccionado = objSeleccionado
			}
			else {
				this.boton.cambiarSeleccion(false)
				this.botonSeleccionado = null
			}
		}
	}

	// Si esta seleccionando el botón, comienza el juego
	onMouseClick(e) {
		if(this.botonSeleccionado !== null && this.botonSeleccionado !== undefined) {
			this.quitarMenu()
			this.comenzarJuego()
		}
		else if (this.partida){
			this.partida.procesarBoton('DOWN')
		}
	}

	onWheel(e){
		if (e.deltaY < 0)
		{
			console.log('scrolling up')
			this.partida.procesarBoton('UP_RIGHT')
		}
		else if (e.deltaY > 0)
		{
			console.log('scrolling down')
			this.partida.procesarBoton('UP_LEFT')
		}
	}

	// Quita el menu principal de la escenta, el vector de botones
	// y el seleccionado los pone a null
	quitarMenu() {
		this.remove(this.menuPrincipal)

		this.boton = null
		this.botonSeleccionado = null
	}

	// Crea una partida con la dificultad seleccionada, y ajusta la camara, y las luces
	comenzarJuego() {
		this.partida = new Partida()
		this.add(this.partida)
		this.partida.iniciarPartida()
			
		this.spotLight.position.z = this.partida.tablero.tamBloque * (this.partida.tablero.filas + this.partida.tablero.columnas) + 20
	}

	// Si debug esta activado, actualiza la posicion de la camara
	update() {
		if(Tetris.debug)
			this.cameraControl.update()

		this.renderer.render(this, this.getCamera())

		requestAnimationFrame(() => this.update())

		TWEEN.update()
	}

}

$(function () {

	let timer = null
	var scene = new Tetris("#WebGL-output")

	window.addEventListener("resize", () => scene.onWindowResize()) // para que se haga resize de la ventana
	window.addEventListener("keydown", (e) => scene.onKeyDown(e)) // detecta que se ha pulsado una tecla de teclado
	window.addEventListener("mousemove", (e) => scene.onMouseMove(e)) // Detecta el movimiento del ratón para saber que clicka botones
	window.addEventListener("click", (e) => scene.onMouseClick(e)) // Detecta click izq
	window.addEventListener("mousedown",(e) => {
		timer=setInterval(() => scene.onMouseClick(e), 100) 
	})
	window.addEventListener("mouseup",(e) => {
		if (timer) clearInterval(timer)
	})
	window.addEventListener("wheel", (e) => scene.onWheel(e)) //Detecta rueda
	window.addEventListener("contextmenu", (e) => scene.onMouseClick(e)) // Detecta click derecho

	scene.update()
})

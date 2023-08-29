// Alumno: Miguel Carracedo Rodríguez
// Alumno: Pedro Padilla Reyes

import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'

import { Pieza } from './Pieza.js'
import { TipoPiezas } from './TipoPiezas.js'


class Tablero extends THREE.Group {
	static FILAS_PREDETERMINADO = 15
	static COLUMNAS_PREDETERMINADO = 5

	constructor(partida, filas = Tablero.FILAS_PREDETERMINADO, columnas = Tablero.COLUMNAS_PREDETERMINADO) {
		super()

		//numero de filas columnas e importamos la partida, con tamaño minimo de 4 filas y columnas
		this.filas = filas > 3 ? filas : 4
		this.columnas = columnas > 3 ? columnas : 4
		this.tablero = new THREE.Group()
		this.partida = partida

		this.tamBloque = 2

		this.crearFondo(this.tamBloque,columnas,filas)

		this.piezas = new THREE.Group()
		this.vPiezas = []	// Referencias a los bloques que hay en el tablero

		this.add(this.piezas)

		// Referencia a las piezas de los bloques que hay en el tablero
		this.matrizTablero = [] 

		for (let i = 0; i < this.filas; i++)
			this.matrizTablero.push((new Array(this.columnas).fill(null)))

		this.putImagesInMenu()
	}

	comenzarJuego() {
		this.generarSiguiente()
		this.generarPieza()
	}

	crearFondo(tamanio, columnas, filas){

		let geometry = new THREE.BoxGeometry(columnas*tamanio+0.5, filas*tamanio+0.5, tamanio*2+2)
		let geometry1 = new THREE.BoxGeometry(columnas*tamanio, filas*tamanio, tamanio)

		var csg = new CSG()

		const loader = new THREE.TextureLoader()

		this.texture = loader.load('../imgs/fondo.png')

		let material = new THREE.MeshPhongMaterial({color: null, map: this.texture, opacity: 1.0, transparent: false})

		var cajaGrande = new THREE.Mesh(geometry,material)
		var cajaPequeña = new THREE.Mesh(geometry1,material)

		cajaGrande.position.z -= tamanio

		csg.union([cajaGrande])
		csg.subtract([cajaPequeña])		

		this.add(csg.toMesh())
	}

	putImagesInMenu () {
		let mouseScroll = this.imageLoader('../imgs/mouse_scroll.png', [2, 4, 1])
		mouseScroll.rotation.y += Math.PI / 6
		mouseScroll.position.x -= 25
		mouseScroll.position.y += 8
		this.add(mouseScroll)

		let mouseClick = this.imageLoader('../imgs/mouse_click2.png', [3, 3, 1])
		mouseClick.rotation.y += Math.PI / 6
		mouseClick.rotation.x -= Math.PI / 16
		mouseClick.rotation.z += Math.PI / 120// Math.PI / 30
		mouseClick.position.x -= 25
		mouseClick.position.y -= 8
		this.add(mouseClick)

		let a_or_d = this.imageLoader('../imgs/A_OR_D.png', [8, 3, 1])
		a_or_d.rotation.y += Math.PI / 10
		a_or_d.rotation.x -= Math.PI / 16
		a_or_d.rotation.z -= Math.PI / 120// Math.PI / 30

		a_or_d.position.x -= 25
		a_or_d.position.y -= 16
		this.add(a_or_d)

		let arrow_left = this.imageLoader('../imgs/arrow.png', [2, 2, 1])
		arrow_left.rotation.y += Math.PI / 10
		arrow_left.rotation.x -= Math.PI / 16
		arrow_left.rotation.z -= Math.PI / 120 + 0.08// Math.PI / 30

		arrow_left.position.x -= 27
		arrow_left.position.y += 1
		this.add(arrow_left)

		let arrow_right = this.imageLoader('../imgs/arrow.png', [2, 2, 1])
		arrow_right.rotation.y += Math.PI / 10
		arrow_right.rotation.x -= Math.PI / 16
		arrow_right.rotation.z -= Math.PI  - 0.08/// Math.PI / 30

		arrow_right.position.x -= 23
		arrow_right.position.y += 1
		this.add(arrow_right)
	}
	
	imageLoader(link, sizes) {
		const loader = new THREE.TextureLoader()
		let texture = loader.load(link)
		let geometry = new THREE.BoxGeometry(sizes[0], sizes[1], sizes[2])

		var csg = new CSG()

		let material = new THREE.MeshPhongMaterial({color: null, map: texture, opacity: 1.0, transparent: false})

		var cajaGrande = new THREE.Mesh(geometry,material)

		csg.union([cajaGrande])

		return csg.toMesh()
	}

	// Genera la pieza siguiente que se va a anadir al tablero
	generarSiguiente(tipo = null) {
		if(tipo === null || tipo === undefined)
				tipo = TipoPiezas.aleatorio()

		this.siguiente = new Pieza(this.tamBloque, tipo)
	}

	// si hay espacio se genera la siguiente pieza y se genera la preview
	// también se incrementa la velocidad
	generarPieza() {
		if (!this.comprobarTecho()) {
			let pieza = this.siguiente
			pieza.position.set(0,0,0)
			let preview = new Pieza(pieza.tamBloque, pieza.tipo, null, 0.5)
			const posicion = new THREE.Vector2(Math.floor(this.columnas/2) - Math.round(pieza.anchura/2), 0)

			pieza.setPosicion(posicion.x, posicion.y, this.filas, this.columnas)
			preview.copiarPosicion(pieza)

			this.piezas.add(pieza)
			this.vPiezas.push(pieza)

			this.piezas.add(preview)

			this.piezaActiva = pieza
			this.preview = preview

			this.tumbarPieza(this.preview)

			this.generarSiguiente()
			this.partida.actualizarSiguiente(this.siguiente)
			this.partida.incrementarVelocidad()
		}
		else
			this.partida.finDeJuego()
	}
	
	// Aplica una bajada a la pieza, y si está abajo se marca como no activa
	bajarPieza(pieza = null, tumbada = false) {
		if(pieza === null || pieza === undefined)
			pieza = this.piezaActiva

		if(pieza !== null) {
			if(!this.comprobarSuelo(pieza) && 
				!this.comprobarColision(pieza, 0, 1)) {
					if(tumbada) {
						pieza.posBloques.forEach((p) => {
							this.matrizTablero[p.y][p.x] = null
						})
					}

					pieza.desplazar(0, 1)

					if(tumbada) {
						pieza.posBloques.forEach((p, i) => {
							this.matrizTablero[p.y][p.x] = pieza.bloque.children[i]
						})
					}

					return true
				}
			else {
				this.registraPieza(pieza)

				if(pieza === this.piezaActiva) {
					this.quitarPiezaActiva()
					this.comprobarFilas()
					this.generarPieza()
				}
			}
		}

		return false
	}

	// Pone a null la pieza activa y elimina su preview
	quitarPiezaActiva() {
		this.piezas.remove(this.preview)
		this.preview.destruir()
		
		this.piezaActiva = null
		this.preview = null
	}

	// Baja hasta el final la pieza, y devuelve las filas bajadas
	tumbarPieza(pieza = null) {
		if(pieza === null || pieza === undefined)
			pieza = this.piezaActiva

		let bajado = 0

		while(this.bajarPieza(pieza))
			bajado++

		return bajado
	}

	// Mueve la pieza activa horizontalmente
	desplazarHorizontalmente(direccion) {
		if(this.piezaActiva !== null) {
			let desplazamiento = direccion.toUpperCase() == 'LEFT' ? -1 : 1

			if(!this.chocaParedes(this.piezaActiva, desplazamiento) && 
			!this.comprobarColision(this.piezaActiva, desplazamiento)) {
				this.piezaActiva.desplazar(desplazamiento, 0)

				this.preview.copiarPosicion(this.piezaActiva)
				this.tumbarPieza(this.preview)
			}
		}
	}

	// Comprueba si pieza choca con otra
	comprobarColision(pieza, x = 0, y = 0) {
		let choca = false

		this.vPiezas.forEach((p) => {
			if(p !== pieza && p.cubreArea(pieza.posBloques, x, y)) {
				if(!(pieza == this.preview && p == this.piezaActiva)) {
					choca = true
				}
			}
		})
		
		return choca
	}

	// Devuelve true si ha llegado al final del tablero
	comprobarSuelo(pieza) {
		let choca = false

		pieza.posBloques.forEach((p) => {
			if(p.y >= this.filas - 1) {
				choca = true
			}
		})

		return choca
	}

	// Comprueba si hay espacio para otra pieza
	comprobarTecho() {
		let choca = false

		this.matrizTablero[0].forEach((e) => {
			if(e !== null) {
				choca = true
			}
		})

		return choca
	}

	// Comprueba si se saldria del tablero en el siguiente desplazamiento
	chocaParedes(pieza, desplazamiento = 0) {
		let choca = false

		pieza.posBloques.forEach((p) => {
			if((p.x + desplazamiento) < 0 || 
			(p.x + desplazamiento) >= this.columnas) {
				choca = true
			}
		})

		return choca
	}

	// Añade  las piezas de ese bloque a la lista de piezas
	registraPieza(pieza = null) {
		if(pieza === null || pieza === undefined)
			pieza = this.piezaActiva

		if(pieza !== null && pieza != this.preview) {
			let bloquesIndividuales = pieza.devolverPiezasIndividuales()

			bloquesIndividuales.forEach((e) => {
				if(e[1].y >= 0)
					this.matrizTablero[e[1].y][e[1].x] = e[0]
			})
		}
	}

	// Comprueba si hay una linea completa, y si así es, la elimina y se aplica, entonces vuelve a comprobar ya que las piezas de arriba caen
	comprobarFilas() {
		let i = this.filas - 1
		let filasLimpiadas = 0

		while(i >= 0) {
			if(this.comprobarFila(i)) {
				this.limpiarFila(i)

				this.aplicarCaida(i)

				filasLimpiadas++
				i = this.filas - 1
			}
			else
				i--
		}

		this.partida.sumarLimpiadaFilas(filasLimpiadas)
	}

	// Elimina una fila de bloques 
	limpiarFila(fila) {
		const f = this.matrizTablero[fila]

		f.forEach((c, j) => {
			if(c !== null) {	// Volver a comprobar si ha cambiado la matriz
				let pieza = c.parent.parent
				let nuevosHijos = pieza.quitar(c, this.filas, this.columnas)
				this.quitarPieza(pieza)
				this.matrizTablero[fila][j] = null

				nuevosHijos.forEach((h) => {
					let pos = h.posBloques[0]
						
					if(pos.y != fila) {	// Solo lo cogemos si no coincide con la fila limpiada
						this.matrizTablero[pos.y][pos.x] = h.bloque.children[0]

						this.addPieza(h)
					}
					else
						this.matrizTablero[pos.y][pos.x] = null
				})
			}

		})
	}

	// Se bajan las piezas que estaban arriba de fila
	aplicarCaida(fila) {
		let techo = false

		for(let i = fila - 1; i > 0 && !techo; i--) {
			for(let j = 0; j < this.columnas; j++)
				if(this.matrizTablero[i][j] !== null) {
					let pieza = this.matrizTablero[i][j]

					while(this.bajarPieza(pieza.parent.parent, true));
				}

			if(i >= 2)	techo = this.matrizTablero[i - 2].every(c => c !== null)
		}
	}

	// Devuelve true cuando la fila esta llena

	comprobarFila(fila) {
		return this.matrizTablero[fila].every(c => c !== null)
	}

	// Añade una pieza al vector
	addPieza(pieza) {
		this.piezas.add(pieza)

		this.vPiezas.push(pieza)
	}

	// Quita la pieza del grupo, y del vector de referencias
	quitarPieza(pieza) {
		if(pieza == this.piezaActiva)
			this.piezas.remove(this.preview)

		this.piezas.remove(pieza)

		const i = this.vPiezas.indexOf(pieza)
		this.vPiezas.splice(i, 1)
	}

	// Comprueba si el bloque chocaria con algo una vez rotado
	comprobarRotacion(pieza, posRotado) {
		let choca = false

		posRotado.forEach((p) => {
			if(p.x < 0 || p.x >= this.columnas) {
				choca = true
			}
		})

		this.vPiezas.forEach((p) => {
			if(p !== pieza && p.cubreArea(posRotado, 0, 0)) {
				choca = true
			}
		})
		
		return choca
	}

	// Aplica una rotación de 90 grados a la pieza activa
	rotar(event) {
		let angle = event === 'UP_LEFT' ? -Math.PI/2 : Math.PI/2
		let posRotado = this.piezaActiva.rotarPosPiezas(angle)

		if(!this.comprobarRotacion(this.piezaActiva, posRotado)) {
			this.piezaActiva.rotar(posRotado)

			this.preview.copiarRotacion(this.piezaActiva)
			this.tumbarPieza(this.preview)
		}
	}
}

export { Tablero }


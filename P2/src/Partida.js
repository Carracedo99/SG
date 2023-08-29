// Alumno: Miguel Carracedo Rodríguez
// Alumno: Pedro Padilla Reyes

import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'
import { Tablero } from './Tablero.js'
import { Texto } from './Texto.js'

class Partida extends THREE.Group {
    constructor() {
        super()

        let filas = 15
        let columnas = 10
        this.puntuacion = 0
        this.lineasCompletadas = 0
        this.velocidad = 1800
        this.acabada = false

        this.tablero = new Tablero(this, filas, columnas)
		this.add(this.tablero)

        // Textos de puntuación, siguiente bloque y lineas completadas
        this.textoLineasPosicion = new THREE.Vector3(columnas*2, -filas/1.3 - 4, 0)
        this.textoPuntuacionPosicion = new THREE.Vector3(columnas*2, -filas/10 - 4, 0)
        this.textoTituloPuntuacion = new Texto(new THREE.Vector3(columnas*2, -filas/10, 0), 1, 'Score')
        this.textoPuntuacion = new Texto(this.textoPuntuacionPosicion, 2, this.puntuacion.toString())
        this.textoTituloLineas = new Texto(new THREE.Vector3(columnas*2, -filas/1.3, 0), 1, 'Lineas')
        this.textoLineas = new Texto(this.textoLineasPosicion, 2, this.lineasCompletadas.toString())
        this.siguientePos = new THREE.Vector3(columnas*2, filas/2, 0)
        this.textoTituloSiguiente = new Texto(new THREE.Vector3(columnas*2, filas/2 + 4, 0), 1, 'Next shape')

        //Manual de ayuda a controles
        this.textoComandos1 = new Texto(new THREE.Vector3(-columnas*2.5, filas/2 + 4, 0), 1, 'Rotar Figura')
        this.textoComandos2 = new Texto(new THREE.Vector3(-columnas*2.5, filas/2 - 4 , 0), 1, 'Mover Figura')
        this.textoComandos3 = new Texto(new THREE.Vector3(-columnas*2.5, filas/2 - 12 , 0), 1, 'Bajar Figura')
        this.textoComandos4 = new Texto(new THREE.Vector3(-columnas*2.5, filas/2 - 20, 0), 1, 'Cambiar Iluminacion')

        this.add(this.textoTituloPuntuacion)
        this.add(this.textoPuntuacion)
        this.add(this.textoTituloLineas)
        this.add(this.textoLineas)

        this.add(this.textoTituloSiguiente)

        this.add(this.textoComandos1)
        this.add(this.textoComandos2)
        this.add(this.textoComandos3)
        this.add(this.textoComandos4)

    }

    // Inicia la animacion de tween y le avia a tablero
    iniciarPartida() {
        if(!this.acabada) {
            this.iniciarAnimacionPiezas()
            this.tablero.comenzarJuego()
        }
    }

    incrementarVelocidad(velocidad = 50) {
        if (this.velocidad > 300) {
            this.velocidad -= velocidad
            this.actualizarVelocidad()
        }
    }

    // Suma puntuación dependiendo del numero de lineas completadas
    sumarLimpiadaFilas(num) {
        if(num > 0) {
            this.lineasCompletadas += num
            this.actualizarTextoLineas()
            switch(num) {
            case 1:
                this.sumarPuntuacion(100)
            break
            case 2:
                this.sumarPuntuacion(200)
            break
            case 3:
                this.sumarPuntuacion(400)
            break
            case 4:
                this.sumarPuntuacion(600)
            break
            default:
                this.sumarPuntuacion(num * 150)
            break
            }
        }
    }

    // Suma la puntuacion y actualiza el texto
    sumarPuntuacion(num) {
        this.puntuacion += num
        this.actualizarTextoPuntuacion()
    }

    // Borra y vuelve a añadir el texto a la pantalla para que se actualice
    actualizarTextoPuntuacion() {
        this.remove(this.textoPuntuacion)
        this.textoPuntuacion.destruir()
        this.textoPuntuacion = new Texto(this.textoPuntuacionPosicion, 2, this.puntuacion.toString())
        this.add(this.textoPuntuacion)
    }

    // Borra y vuelve a añadir el texto a la pantalla para que se actualice
    actualizarTextoLineas() {
        this.remove(this.textoLineas)
        this.textoLineas.destruir()
        this.textoLineas = new Texto(this.textoLineasPosicion, 2, this.lineasCompletadas.toString())
        this.add(this.textoLineas)
    }

    // Inicia la animacion de Tween, llama cada this.velocidad a bajarPieza
    iniciarAnimacionPiezas() {
		let pIni = {y : 0}, pFin = {y : 1}
		let that = this

		this.animacionPiezas = new TWEEN.Tween(pIni).to(pFin, this.velocidad)
		.onRepeat(function() {
			that.tablero.bajarPieza()
		})
		.repeat(Infinity).start()
	}

    // Crea de nuevo la animacion de gravedad
    actualizarVelocidad() {
        this.acabarAnimacionPiezas()
        this.iniciarAnimacionPiezas()
    }

	acabarAnimacionPiezas() {
		this.animacionPiezas.stop()
	}

    // Realiza la accion correspondiente con el evento pasado por parámetros
    procesarBoton(event) {
        if(!this.acabada) {
            switch (event)
            {
                case 'DOWN':
                    if(this.tablero.bajarPieza())
                        this.sumarBajada()
                    break
                case 'UP_RIGHT':
                    this.tablero.rotar(event)
                break
                case 'UP_LEFT':
                    this.tablero.rotar(event)
                    break
                case 'RIGHT':
                    this.tablero.desplazarHorizontalmente(event)
                    break
                case 'LEFT':
                    this.tablero.desplazarHorizontalmente(event)
                    break
            }
        }
    }

    // Suma el numero de filas que baja con velocidad
    sumarBajada(filas = 1) {
        this.sumarPuntuacion(filas)
    }

    // Finaliza las animaciones normales de piezas y empieza la de fin de juego
    finDeJuego() {
        this.acabada = true
        this.acabarAnimacionPiezas()
        this.animacionFinDeJuego()
        console.log("Fin de juego")
    }

    // Anima el game over
    animacionFinDeJuego() {
        this.textoFinJuego = new Texto(new THREE.Vector3(0, 0, -50), 3, 'GAME OVER', new THREE.MeshStandardMaterial({color: 0xFF0000}))
    
        this.add(this.textoFinJuego)

        let inicial = {z : -50}, final = {z : 15}

		this.animacionFinJuego = new TWEEN.Tween(inicial).to(final, 1000).onUpdate((p) => {
            this.textoFinJuego.position.z = p.z
        }).start()
    }

    // Añade la siguiente figura que vendrá al tablero
    actualizarSiguiente(siguiente) {
        if(this.siguiente)
            this.remove(this.siguiente)

        this.siguiente = siguiente
        this.siguiente.position.copy(this.siguientePos)
        this.add(this.siguiente)
    }
}

export {Partida}

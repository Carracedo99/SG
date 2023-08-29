// Alumno: Miguel Carracedo Rodríguez
// Alumno: Pedro Padilla Reyes

import * as THREE from '../libs/three.module.js'
import { Boton } from './Boton.js'
import { Texto } from './Texto.js'

const DEFAULT_TITLE_POS = new THREE.Vector3(0, 10, 0)
const DEFAULT_BUTTON_POS = new THREE.Vector3(0, 0, 0)

class Menu extends THREE.Group {
    
    constructor() {
        super()
        this.boton = null

        this.titulo = new Texto(DEFAULT_TITLE_POS, 5, 'TETRIS SG')
        this.titulo.userData = this

        this.add(this.titulo)
        this.boton = (new Boton(DEFAULT_BUTTON_POS, 'START'))
        this.add(this.boton)
    }

    getBoton() {
        return this.boton
    }
}

export { Menu }
// Alumno: Miguel Carracedo Rodríguez
// Alumno: Pedro Padilla Reyes

import * as THREE from '../libs/three.module.js'
import { Texto } from './Texto.js'

class Boton extends THREE.Group {
    static MATERIAL_SELECCIONADO

    constructor(pos, texto, tam = 2) {
        super()

        if(Boton.MATERIAL_SELECCIONADO === null || Boton.MATERIAL_SELECCIONADO === undefined)
            Boton.MATERIAL_SELECCIONADO = new THREE.MeshStandardMaterial({color: 0x00FF80})
    
        this.texto = new Texto(pos, tam, texto)

        this.add(this.texto)

        this.seleccionado = false
    }

    // Cuando se pasa el cursor por encima de las letras cambia el material para dar feedback
    cambiarSeleccion(valor) {
        if(this.texto.texto !== null && this.texto.texto !== undefined) {
            if(valor)
                this.texto.texto.material = Boton.MATERIAL_SELECCIONADO
            else
                this.texto.texto.material = Texto.MATERIAL
            
            this.seleccionado = valor
        }
    }
}

export { Boton }
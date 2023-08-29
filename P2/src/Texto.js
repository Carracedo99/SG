// Alumno: Miguel Carracedo Rodríguez
// Alumno: Pedro Padilla Reyes

import * as THREE from '../libs/three.module.js'

import { FontLoader } from '../libs/FontLoader.js'
import { TextGeometry } from '../libs/TextGeometry.js'


class Texto extends THREE.Group {
    static MATERIAL

    constructor(posicion, size, texto, material) {
        super()

        // Si no nos pasan un material, se inicia con un material estándar blanco
        if(Texto.MATERIAL === null || Texto.MATERIAL === undefined)
            Texto.MATERIAL = new THREE.MeshStandardMaterial({color: 0xFFFFFF})

        let fontLoader = new FontLoader()
        let that = this

        this.material = material ?? Texto.MATERIAL

        // Fuente de https://www.dafont.com/retro-gaming.font
        fontLoader.load('../fonts/Retro-gaming.json', (f) => {
            let textoGeo = new TextGeometry(texto, {
                font: f,
                size: size,
                height: size/5
            })

            // Centra el texto
            textoGeo.computeBoundingBox()
            textoGeo.center()

            that.texto = new THREE.Mesh(textoGeo, this.material)
            that.texto.userData = that

            that.add(that.texto)
            that.position.copy(posicion)
        })
    }

    // Borra la geometria del texto
    destruir() {
        if(this.texto !== null && this.texto !== undefined) {
            this.texto.geometry.dispose()
            this.remove(this.texto)
        }
    }
}

export {Texto}
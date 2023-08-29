// Alumno: Miguel Carracedo Rodríguez
// Alumno: Pedro Padilla Reyes

import * as THREE from '../libs/three.module.js'
import { TipoPiezas } from './TipoPiezas.js'

class Pieza extends THREE.Group {
    static texture

	constructor(size, tipo, color = null) {
		super()

        const loader = new THREE.TextureLoader()
        this.texture = loader.load('../imgs/textura_bloque.png')

        this.tipo = tipo.toUpperCase()
        this.size = size
		this.bloque = this.crearPiezas(color)
		this.add(this.bloque)
	}

    // Crea la geometria de una pieza que compone el bloque
	crearBloque() {		
		return new THREE.BoxBufferGeometry(this.size, this.size, this.size)
	}

    // Crea las 4 piezas que componen un bloque
    crearPiezas(color = null, alfa = 1.0) {
        this.tipo = this.tipo.toUpperCase()

        if (!TipoPiezas.esValido(this.tipo))
            this.tipo = TipoPiezas.predeterminado()

        if (!color)
            color = TipoPiezas.getColor(this.tipo)

        const transparente = alfa == 1.0 ? false : true
        
        this.material = new THREE.MeshPhongMaterial({color: color, map: this.texture,
        opacity: alfa, transparent: transparente})

        let bloques
        let pos = []

        // Posición absoluta y relativa de las piezas y sus bloques
        switch(this.tipo) {
            case 'I':
                pos = [
                    new THREE.Vector3(-this.size, 0, 0, 0),
                    new THREE.Vector3(0, 0, 0),
                    new THREE.Vector3(this.size, 0, 0),
                    new THREE.Vector3(2*this.size, 0, 0)
                ]
                this.posBloques = [
                    new THREE.Vector2(0, 1),
                    new THREE.Vector2(1, 1),
                    new THREE.Vector2(2, 1),
                    new THREE.Vector2(3, 1)
                ]
                this.centroRotacion = new THREE.Vector2(1, 1)  // En que posicion aplicamos las rotaciones relativas
                this.anchura = 4
                this.altura = 1

                bloques = this.generarPieza(pos)

                bloques.position.x = -this.size/2
                bloques.position.y = -this.size/2
            break

            case 'J':
                pos = [
                    new THREE.Vector3(-this.size, 0, 0), 
                    new THREE.Vector3(0, 0, 0),
                    new THREE.Vector3(this.size, 0, 0),
                    new THREE.Vector3(this.size, -this.size, 0)
                ]
                this.posBloques = [
                    new THREE.Vector2(0, 0), 
                    new THREE.Vector2(1, 0),
                    new THREE.Vector2(2, 0),
                    new THREE.Vector2(2, 1)
                ]
                this.centroRotacion = new THREE.Vector2(1, 0)
                this.anchura = 3
                this.altura = 2

                bloques = this.generarPieza(pos)

                bloques.position.x = -this.size/2
                bloques.position.y = this.size/2
            break

            case 'L':
                pos = [
                    new THREE.Vector3(-this.size, 0, 0),
                    new THREE.Vector3(-this.size, -this.size, 0),
                    new THREE.Vector3(0, 0, 0),
                    new THREE.Vector3(this.size, 0, 0)
                ]
                this.posBloques = [
                    new THREE.Vector2(0, 0),
                    new THREE.Vector2(0, 1),
                    new THREE.Vector2(1, 0),
                    new THREE.Vector2(2, 0)
                ]
                this.centroRotacion = new THREE.Vector2(1, 0)
                this.anchura = 3
                this.altura = 2

                bloques = this.generarPieza(pos)

                bloques.position.x = -this.size/2
                bloques.position.y = this.size/2
            break

            case 'O':
                pos = [
                    new THREE.Vector3(-this.size/2, this.size/2, 0), 
                    new THREE.Vector3(-this.size/2, -this.size/2, 0),
                    new THREE.Vector3(this.size/2, this.size/2, 0),
                    new THREE.Vector3(this.size/2, -this.size/2, 0)
                ]
                this.posBloques = [
                    new THREE.Vector2(0, 0), 
                    new THREE.Vector2(0, 1),
                    new THREE.Vector2(1, 0),
                    new THREE.Vector2(1, 1)
                ]
                this.centroRotacion = new THREE.Vector2(0.5, 0.5)
                this.anchura = 2
                this.altura = 2

                bloques = this.generarPieza(pos)
            break

            case 'S':
                pos = [
                    new THREE.Vector3(-this.size, 0, 0), 
                    new THREE.Vector3(0, 0, 0),
                    new THREE.Vector3(0, -this.size, 0),
                    new THREE.Vector3(this.size, -this.size, 0)
                ]
                this.posBloques = [
                    new THREE.Vector2(0, 0),
                    new THREE.Vector2(1, 0),
                    new THREE.Vector2(1, 1),
                    new THREE.Vector2(2, 1)
                ]
                this.centroRotacion = new THREE.Vector2(1, 0)
                this.anchura = 3
                this.altura = 2

                bloques = this.generarPieza(pos)

                bloques.position.x = -this.size/2
                bloques.position.y = this.size/2
            break

            case 'T':
                pos = [
                    new THREE.Vector3(-this.size, 0, 0), 
                    new THREE.Vector3(0, 0, 0),
                    new THREE.Vector3(0, -this.size, 0),
                    new THREE.Vector3(this.size, 0, 0)
                ]
                this.posBloques = [
                    new THREE.Vector2(0, 0), 
                    new THREE.Vector2(1, 0),
                    new THREE.Vector2(1, 1),
                    new THREE.Vector2(2, 0)
                ]
                this.centroRotacion = new THREE.Vector2(1, 0)
                this.anchura = 3
                this.altura = 2

                bloques = this.generarPieza(pos)

                bloques.position.x = -this.size/2
                bloques.position.y = this.size/2
            break

            case 'Z':
                pos = [
                    new THREE.Vector3(-this.size, -this.size, 0),
                    new THREE.Vector3(0, 0, 0),
                    new THREE.Vector3(0, -this.size, 0),
                    new THREE.Vector3(this.size, 0, 0)
                ]
                this.posBloques = [
                    new THREE.Vector2(0, 1),
                    new THREE.Vector2(1, 0),
                    new THREE.Vector2(1, 1),
                    new THREE.Vector2(2, 0)
                ]
                this.centroRotacion = new THREE.Vector2(1, 0)
                this.anchura = 3
                this.altura = 2

                bloques = this.generarPieza(pos)
                
                bloques.position.x = -this.size/2
                bloques.position.y = this.size/2
            break

            case 'B':
                pos = [new THREE.Vector3(0, 0, 0)]
                this.posBloques = [new THREE.Vector2(0, 1)]
                this.centroRotacion = new THREE.Vector2(0, 0)
                this.anchura = 1
                this.altura = 1

                bloques = this.generarPieza(pos)

                bloques.position.x = -this.size/2
                bloques.position.y = -this.size/2
            break
        }

        return bloques
    }

    // Funcion auxiliar de la anterior, crea la pieza a partir de las posiciones de los bloques
    generarPieza(pos) {
        let pieza = new THREE.Group()
        
        pos.forEach((p) => {
            let bloqueGeo = this.crearBloque(this.size)
            let bloque = new THREE.Mesh(bloqueGeo, this.material)
            
            bloque.position.set(p.x, p.y, p.z)

            pieza.add(bloque)
        })

        return pieza
    }

    // Funcion para mover la pieza en coordenadas relativas
    desplazar(x = 0, y = 0) {
		this.position.x += x*this.size
        this.position.y -= y*this.size

        this.posBloques.forEach((e, i) => {
            this.posBloques[i].x += x
            this.posBloques[i].y += y
        })

        this.centroRotacion.x += x
        this.centroRotacion.y += y
	}

    // Mueve el bloque a x, y, relativamente a la posición actual
    setPosicion(x, y, filas, columnas) {
        let relativeX = x < 0 ? 0 : x
        let relativeY = y < 0 ? 0 : y

        if (relativeX + this.anchura >= columnas)
            relativeX = columnas - this.anchura

        if (relativeY + this.altura >= filas)
            relativeY = filas - this.altura

        this.position.x += (relativeX - columnas / 2 + Math.round(this.anchura / 2)) * this.size
        this.position.y += (filas / 2 - relativeY) * this.size

        for (const element of this.posBloques) {
            element.x += relativeX
            element.y += relativeY - 1
        }

        this.centroRotacion.x += x
        this.centroRotacion.y += y - 1
    }

    // Copia tanto la posicion relativa como la absoluta
    copiarPosicion(otro) {
        this.position.x = otro.position.x
        this.position.y = otro.position.y
        
        this.posBloques.forEach((p, i) => {
            p.x = otro.posBloques[i].x
            p.y = otro.posBloques[i].y
        })

        this.centroRotacion.x = otro.centroRotacion.x
        this.centroRotacion.y = otro.centroRotacion.y
    }

    // Copia la posicion, la rotacion y las dimensiones
    copiarRotacion(otro) {
        this.copiarPosicion(otro)

        this.bloque.rotation.z = otro.bloque.rotation.z

        this.altura = otro.altura
        this.anchura = otro.anchura
    }

    // Rota el objeto y las posiciones relativas
    rotar(posDestino = null) {
        this.bloque.rotation.z += Math.PI/2
        this.posBloques = posDestino ? posDestino : this.rotarPosPiezas(-Math.PI/2)

        let aux = this.altura
        this.altura = this.anchura
        this.anchura = aux
	}

    // Devuelve los puntos en los que estaría la pieza si se rota
    rotarPosPiezas(angulo) {
        let puntos = []

        this.posBloques.forEach((p, i) => {
            puntos.push(p)
            puntos[i].rotateAround(this.centroRotacion, angulo)
            puntos[i].round()
        })

        return puntos
    }

    // Se le pasa vector de posiciones relativas, y la posición relativa, y devuelve true si el bloque cubre ese área
    cubreArea(area, x = 0, y = 0) {
        let cubre = false

        for(let i = 0; i < this.posBloques.length && !cubre; i++) {
            area.forEach((p) => {
                if((p.x + x) == this.posBloques[i].x && (p.y + y) == this.posBloques[i].y) {
                    cubre = true
                }
            })
        }

        return cubre
    }

    // Devuelve un vector de "pair" que contiene los bloques que componen la pieza, y su posicion relativa
    devolverPiezasIndividuales() {
        let piezas = []

        this.bloque.children.forEach((b, i) => {
            piezas.push([b, this.posBloques[i]])
        })

        return piezas
	}

    // Divide la pieza actual quitando el bloque hijo que se le pasa y se devuelve
    quitar(hijo, filas, columnas) {
        let that = this
        let hijosRestantes = []

        this.bloque.children.forEach((p, i) => {
            if (hijo !== p) {
                let nuevoHijo = new Pieza(that.size, 'B', TipoPiezas.getColor(that.tipo))
                nuevoHijo.setPosicion(that.posBloques[i].x, that.posBloques[i].y, filas, columnas)

                hijosRestantes.push(nuevoHijo)
            }
            
            p.geometry.dispose()
        })

        this.material.dispose()

        return hijosRestantes
    }

    // Destruye la geometria de los hijos, y el material
    destruir() {
        this.bloque.children.forEach((cuadrado) => {            
            cuadrado.geometry.dispose()
        })
        this.material.dispose()
    }
}

export { Pieza }

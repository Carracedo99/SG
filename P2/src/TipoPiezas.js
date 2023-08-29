// Alumno: Miguel Carracedo Rodríguez
// Alumno: Pedro Padilla Reyes

const TIPO_PREDETERMINADO = 'I'
class TipoPiezas {
    static TIPOS = {I: 0xFF0000, J: 0xFFFF00, L: 0x00FF00, O: 0x00AA00, S: 0x00FFFF, T: 0x0000FF, Z: 0xFF00FF,
    B: 0xFFFFFF}

    // Comprueba si tipo es uno de los tipos disponibles
    static esValido(tipo) {
        let valido = false

        for (const t in TipoPiezas.TIPOS) {
            if (t == tipo){
                valido = true

                break
            }
        }

        return valido
    }

    static predeterminado() {
        return TIPO_PREDETERMINADO
    }

    static getColor(tipo) {
        if (!TipoPiezas.esValido(tipo))
            tipo = TipoPiezas.predeterminado()

        return TipoPiezas.TIPOS[tipo]
    }

    static getTipos() {
        return TipoPiezas.TIPOS
    }

    // Genera un tipo aleatorio
    static aleatorio() {
        const keys = Object.keys(TipoPiezas.TIPOS)

        return keys[Math.floor(Math.random() * (keys.length - 1))]
    }
}

export {TipoPiezas}
class VideoJuego {

    constructor(id, nombre, descripcion, plataforma = "No especificada") {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.plataforma = plataforma;
    }
    
  
    mostrarDatos() {
        console.log(`🎮 ${this.nombre} (ID: ${this.id}) - ${this.descripcion} - Plataforma: ${this.plataforma}`);
    }
}


class GestorVideojuegos {
    
  
    constructor() {
        // Almacena la lista principal de videojuegos
        this.listaVideojuegos = [];
    }

   
    cargarLista(nuevaLista) {
        try {
            if (!Array.isArray(nuevaLista)) {
                throw new Error('La lista proporcionada no es un arreglo válido');
            }
            
            if (nuevaLista.length === 0) {
                throw new Error('La lista proporcionada está vacía');
            }

            // Convertir objetos simples a instancias de VideoJuego
            this.listaVideojuegos = nuevaLista.map(juego => 
                new VideoJuego(juego.id, juego.nombre, juego.descripcion, juego.plataforma)
            );
            
            console.log(` Lista cargada: ${nuevaLista.length} videojuegos`);
            
        } catch (error) {
            console.error(' Error al cargar lista:', error.message);
            throw error;
        }
    }

 
    obtenerLista() {
        try {
            if (!this.listaVideojuegos) {
                throw new Error('La lista de videojuegos no está inicializada');
            }

            if (this.listaVideojuegos.length === 0) {
                throw new Error('La lista de videojuegos está vacía');
            }
            
            return [...this.listaVideojuegos];
            
        } catch (error) {
            console.error(' Error al obtener lista:', error.message);
            throw error;
        }
    }

    /**
     * Realiza búsqueda por ID con validaciones completas
     */
    obtenerPorId(id) {
        try {
            if (id === null || id === undefined) {
                throw new Error('El ID del videojuego es requerido');
            }

            if (typeof id !== 'number' || id <= 0) {
                throw new Error('El ID debe ser un número positivo');
            }

            if (!this.listaVideojuegos || this.listaVideojuegos.length === 0) {
                throw new Error('La lista de videojuegos no está disponible');
            }

            const videojuegoEncontrado = this.listaVideojuegos.find(
                videojuego => videojuego.id === id
            );

            if (!videojuegoEncontrado) {
                throw new Error(`No se encontró videojuego con ID: ${id}`);
            }

            return videojuegoEncontrado;

        } catch (error) {
            console.error(' Error al obtener por ID:', error.message);
            throw error;
        }
    }

    /**
     * Valida y agrega el videojuego a la colección
     */
    agregar(nuevoVideojuego) {
        try {
            if (!this.listaVideojuegos) {
                throw new Error('La lista de videojuegos no está inicializada');
            }

            if (!nuevoVideojuego) {
                throw new Error('El videojuego a agregar es requerido');
            }

            // Validar campos obligatorios
            const camposRequeridos = ['id', 'nombre', 'descripcion', 'plataforma'];
            for (const campo of camposRequeridos) {
                if (!nuevoVideojuego[campo]) {
                    throw new Error(`El campo '${campo}' es obligatorio`);
                }
            }

            // Validar tipos de datos
            if (typeof nuevoVideojuego.id !== 'number') {
                throw new Error('El ID debe ser un número');
            }

            if (typeof nuevoVideojuego.nombre !== 'string' || nuevoVideojuego.nombre.trim() === '') {
                throw new Error('El nombre debe ser un texto válido');
            }

            if (typeof nuevoVideojuego.descripcion !== 'string' || nuevoVideojuego.descripcion.trim() === '') {
                throw new Error('La descripción debe ser un texto válido');
            }

            if (typeof nuevoVideojuego.plataforma !== 'string' || nuevoVideojuego.plataforma.trim() === '') {
                throw new Error('La plataforma debe ser un texto válido');
            }

            // Verificar que no exista un videojuego con el mismo ID
            const idExistente = this.listaVideojuegos.some(
                juego => juego.id === nuevoVideojuego.id
            );
            
            if (idExistente) {
                throw new Error(`Ya existe un videojuego con ID: ${nuevoVideojuego.id}`);
            }

            // Agregar videojuego validado a la lista
            this.listaVideojuegos.push(nuevoVideojuego);
            
            console.log(' Videojuego agregado:', nuevoVideojuego.nombre);
            return nuevoVideojuego;

        } catch (error) {
            console.error(' Error al agregar videojuego:', error.message);
            throw error;
        }
    }

    /**
     * Localiza y actualiza el videojuego con nuevos datos
     */
    actualizar(id, nuevosDatos) {
        try {
            if (!this.listaVideojuegos) {
                throw new Error('La lista de videojuegos no está inicializada');
            }

            if (!id) {
                throw new Error('El ID del videojuego es requerido');
            }

            if (!nuevosDatos || Object.keys(nuevosDatos).length === 0) {
                throw new Error('Se requieren datos para actualizar');
            }

            const indice = this.listaVideojuegos.findIndex(
                videojuego => videojuego.id === id
            );

            if (indice === -1) {
                throw new Error(`No se encontró videojuego con ID: ${id}`);
            }

            const videojuegoActualizado = {
                ...this.listaVideojuegos[indice],
                ...nuevosDatos,
                id: id
            };

            // Validar campos después de la actualización
            const camposRequeridos = ['nombre', 'descripcion', 'plataforma'];
            for (const campo of camposRequeridos) {
                if (!videojuegoActualizado[campo]) {
                    throw new Error(`El campo '${campo}' es requerido`);
                }
            }

            this.listaVideojuegos[indice] = videojuegoActualizado;
            
            console.log(' Videojuego actualizado:', videojuegoActualizado.nombre);
            return videojuegoActualizado;

        } catch (error) {
            console.error(' Error al actualizar videojuego:', error.message);
            throw error;
        }
    }

    /**
     * Busca y elimina el videojuego por ID
     */
    eliminar(id) {
        try {
            if (!this.listaVideojuegos) {
                throw new Error('La lista de videojuegos no está inicializada');
            }

            if (!id) {
                throw new Error('El ID del videojuego es requerido');
            }

            const indice = this.listaVideojuegos.findIndex(
                videojuego => videojuego.id === id
            );

            if (indice === -1) {
                throw new Error(`No se encontró videojuego con ID: ${id}`);
            }

            const videojuegoEliminado = this.listaVideojuegos[indice];
            
            this.listaVideojuegos.splice(indice, 1);
            
            console.log(' Videojuego eliminado:', videojuegoEliminado.nombre);
            return videojuegoEliminado;

        } catch (error) {
            console.error(' Error al eliminar videojuego:', error.message);
            throw error;
        }
    }

    /**
     * Calcula y retorna métricas básicas de la lista
     */
    obtenerEstadisticas() {
        const totalVideojuegos = this.listaVideojuegos ? this.listaVideojuegos.length : 0;
        
        const idsExistentes = this.listaVideojuegos ? 
            this.listaVideojuegos.map(juego => juego.id) : [];
        
        const siguienteId = idsExistentes.length > 0 ? 
            Math.max(...idsExistentes) + 1 : 1;

        return {
            total: totalVideojuegos,
            ids: idsExistentes,
            siguienteIdDisponible: siguienteId
        };
    }
}
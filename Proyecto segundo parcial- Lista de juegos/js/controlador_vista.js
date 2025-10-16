class ControladorVista {
    
    /**
     * CONSTRUCTOR DEL CONTROLADOR DE VISTA
     */
    constructor(gestorVideojuegos) {
        console.log(' Inicializando ControladorVista...');
        
        // Instancia del gestor para operaciones CRUD
        this.gestor = gestorVideojuegos;
        
        // Referencia al contenedor principal de videojuegos
        this.contenedorJuegos = document.getElementById('contenedor_Juegos');
        
        // Referencia al formulario de agregar videojuegos
        this.formularioAgregar = document.getElementById('formulario_Agregar');
        
        // Referencia al botón de agregar
        this.botonAgregar = document.getElementById('boton_Agregar');
        
        // Referencia al contenedor de mensajes de error
        this.mensajeError = document.getElementById('mensaje_error');
        
        console.log(' Elementos DOM:', {
            contenedorJuegos: !!this.contenedorJuegos,
            formularioAgregar: !!this.formularioAgregar,
            botonAgregar: !!this.botonAgregar,
            mensajeError: !!this.mensajeError
        });
        
        // Inicializar event listeners
        this.inicializarEventListeners();
    }

    /**
     * INICIALIZAR EVENT LISTENERS
     */
    inicializarEventListeners() {
        console.log(' Configurando event listeners...');
        
        // Manejador para el evento de agregar videojuego
        this.botonAgregar.addEventListener('click', (evento) => {
            console.log(' Click en botón agregar detectado');
            evento.preventDefault();
            this.manejarAgregarVideojuego();
        });

        console.log(' Event listeners configurados');
    }

    /**
     * RENDERIZAR LISTA COMPLETA DE VIDEOJUEGOS
     */
    renderizarListaVideojuegos() {
        try {
            console.log(' Renderizando lista de videojuegos...');
            
            // Limpiar contenedor antes de renderizar
            this.limpiarContenedor();
            
            // Obtener lista actualizada de videojuegos
            const listaVideojuegos = this.gestor.obtenerLista();
    
            console.log(` Videojuegos a renderizar: ${listaVideojuegos.length}`);
            
            // Validar que hay videojuegos para mostrar
            if (listaVideojuegos.length === 0) {
                this.mostrarMensaje('No hay videojuegos en la lista', 'info');
                return;
            }
            
            // Generar tarjeta para cada videojuego
            listaVideojuegos.forEach(videojuego => {
                this.crearTarjetaVideojuego(videojuego);
            });
            
            console.log(' Lista renderizada correctamente');
            
        } catch (error) {
            console.error(' Error al renderizar lista:', error);
            this.mostrarMensaje(`Error al cargar videojuegos: ${error.message}`, 'error');
        }
    }

    /**
     * CREAR TARJETA INDIVIDUAL DE VIDEOJUEGO
     */
    crearTarjetaVideojuego(videojuego) {
        console.log(' Creando tarjeta para:', videojuego.nombre);
        
        // Crear elemento contenedor principal de la tarjeta
        const tarjeta = document.createElement('div');
        tarjeta.className = 'elementosListaJuegos';
        tarjeta.setAttribute('data-id', videojuego.id);

        // Crear elemento para el título del videojuego
        const titulo = document.createElement('h2');
        titulo.textContent = videojuego.nombre;

        // Crear elemento para la descripción del videojuego
        const descripcion = document.createElement('p');
        descripcion.textContent = videojuego.descripcion;

        // Crear elemento para la plataforma del videojuego
        const plataforma = document.createElement('div');
        plataforma.className = 'plataforma-juego';
        plataforma.innerHTML = `<strong>Plataforma:</strong> ${videojuego.plataforma}`;
        plataforma.style.marginTop = '10px';
        plataforma.style.padding = '8px';
        plataforma.style.background = 'var(--azul-pastel)';
        plataforma.style.borderRadius = '6px';
        plataforma.style.fontSize = '0.9rem';

        // Crear contenedor para botones de acciones
        const contenedorBotones = document.createElement('div');
        contenedorBotones.className = 'contenedor-botones';

        // Crear botón para editar videojuego
        const botonEditar = document.createElement('button');
        botonEditar.className = 'botonEditar';
        botonEditar.textContent = 'Editar';
        botonEditar.addEventListener('click', () => {
            this.manejarEditarVideojuego(videojuego.id);
        });

        // Crear botón para eliminar videojuego
        const botonEliminar = document.createElement('button');
        botonEliminar.className = 'botonEliminar';
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.addEventListener('click', () => {
            this.manejarEliminarVideojuego(videojuego.id);
        });

        // Ensamblar estructura de la tarjeta
        contenedorBotones.appendChild(botonEditar);
        contenedorBotones.appendChild(botonEliminar);
        
        tarjeta.appendChild(titulo);
        tarjeta.appendChild(descripcion);
        tarjeta.appendChild(plataforma);
        tarjeta.appendChild(contenedorBotones);

        // Agregar tarjeta al contenedor principal
        this.contenedorJuegos.appendChild(tarjeta);
        
        console.log(' Tarjeta creada:', videojuego.nombre);
    }

    /**
     * MANEJAR AGREGAR NUEVO VIDEOJUEGO
     */
    manejarAgregarVideojuego() {
        try {
            console.log(' Iniciando proceso de agregar videojuego...');
            
            // Obtener valores directamente de los inputs
            const titulo = document.querySelector('input[name="titulo"]').value;
            const descripcion = document.querySelector('input[name="descripcion"]').value;
            const plataforma = document.querySelector('input[name="plataforma"]').value;
            
            console.log(' Datos capturados:', { titulo, descripcion, plataforma });
            
            // Validar campos del formulario
            if (!titulo || !descripcion || !plataforma) {
                throw new Error('Todos los campos son obligatorios');
            }

            // Obtener siguiente ID disponible
            const estadisticas = this.gestor.obtenerEstadisticas();
            const nuevoId = estadisticas.siguienteIdDisponible;

            // Crear nuevo objeto videojuego
            const nuevoVideojuego = {
                id: nuevoId,
                nombre: titulo.trim(),
                descripcion: descripcion.trim(),
                plataforma: plataforma.trim()
            };

            console.log(' Videojuego a agregar:', nuevoVideojuego);

            // Agregar videojuego mediante el gestor
            this.gestor.agregar(nuevoVideojuego);
            
            // Actualizar interfaz
            this.renderizarListaVideojuegos();
            
            // Limpiar formulario y mostrar confirmación
            this.formularioAgregar.reset();
            this.mostrarMensaje('Videojuego agregado exitosamente', 'exito');
            
            console.log('Videojuego agregado correctamente');
            
        } catch (error) {
            console.error(' Error al agregar videojuego:', error);
            this.mostrarMensaje(`Error: ${error.message}`, 'error');
        }
    }

    /**
     * MANEJAR EDICIÓN DE VIDEOJUEGO
     */
    manejarEditarVideojuego(id) {
        try {
            console.log(' Editando videojuego ID:', id);
            
            // Obtener videojuego actual
            const videojuegoActual = this.gestor.obtenerPorId(id);
            
            // Solicitar nuevos datos al usuario
            const nuevoNombre = prompt('Nuevo nombre:', videojuegoActual.nombre);
            const nuevaDescripcion = prompt('Nueva descripción:', videojuegoActual.descripcion);
            const nuevaPlataforma = prompt('Nueva plataforma:', videojuegoActual.plataforma);
            
            // Validar que se proporcionaron datos
            if (!nuevoNombre || !nuevaDescripcion || !nuevaPlataforma) {
                this.mostrarMensaje('La edición fue cancelada', 'info');
                return;
            }

            // Preparar datos actualizados
            const datosActualizados = {
                nombre: nuevoNombre.trim(),
                descripcion: nuevaDescripcion.trim(),
                plataforma: nuevaPlataforma.trim()
            };

            // Actualizar videojuego mediante gestor
            this.gestor.actualizar(id, datosActualizados);
            
            // Actualizar interfaz
            this.renderizarListaVideojuegos();
            
            // Mostrar confirmación
            this.mostrarMensaje('Videojuego actualizado exitosamente', 'exito');
            
        } catch (error) {
            console.error(' Error al editar videojuego:', error);
            this.mostrarMensaje(`Error al editar: ${error.message}`, 'error');
        }
    }

  
    manejarEliminarVideojuego(id) {
        try {
            console.log(' Eliminando videojuego ID:', id);
            
            // Obtener videojuego para mostrar información
            const videojuego = this.gestor.obtenerPorId(id);
            
            // Solicitar confirmación al usuario
            const confirmacion = confirm(
                `¿Estás seguro de eliminar "${videojuego.nombre}"?\nPlataforma: ${videojuego.plataforma}\n\nEsta acción no se puede deshacer.`
            );

            // Proceder con eliminación si se confirma
            if (confirmacion) {
                this.gestor.eliminar(id);
                this.renderizarListaVideojuegos();
                this.mostrarMensaje('Videojuego eliminado exitosamente', 'exito');
            } else {
                this.mostrarMensaje('Eliminación cancelada', 'info');
            }
            
        } catch (error) {
            console.error(' Error al eliminar videojuego:', error);
            this.mostrarMensaje(`Error al eliminar: ${error.message}`, 'error');
        }
    }

  
    mostrarMensaje(texto, tipo = 'info') {
        console.log('💬 Mostrando mensaje:', { texto, tipo });
        
        // Configurar estilos según el tipo de mensaje
        const estilos = {
            error: { color: '#d32f2f', backgroundColor: '#ffebee' },
            exito: { color: '#388e3c', backgroundColor: '#e8f5e8' },
            info: { color: '#1976d2', backgroundColor: '#e3f2fd' }
        };

        const estilo = estilos[tipo] || estilos.info;

        // Aplicar estilos al elemento de mensaje
        Object.assign(this.mensajeError.style, {
            display: 'block',
            padding: '12px',
            margin: '10px 0',
            borderRadius: '4px',
            border: `1px solid ${estilo.color}20`,
            color: estilo.color,
            backgroundColor: estilo.backgroundColor,
            fontSize: '14px'
        });

        // Establecer texto y mostrar elemento
        this.mensajeError.textContent = texto;
        this.mensajeError.hidden = false;

        // Ocultar mensaje automáticamente después de 5 segundos
        setTimeout(() => {
            this.mensajeError.hidden = true;
        }, 5000);
    }

    /**
     * LIMPIAR CONTENEDOR DE VIDEOJUEGOS
     */
    limpiarContenedor() {
        console.log('🧹 Limpiando contenedor...');
        while (this.contenedorJuegos.firstChild) {
            this.contenedorJuegos.removeChild(this.contenedorJuegos.firstChild);
        }
    }

    inicializar() {
        try {
            console.log('🚀 Inicializando ControladorVista...');
            
            // Renderizar lista inicial de videojuegos
            this.renderizarListaVideojuegos();
            
            // Mostrar mensaje de bienvenida
            this.mostrarMensaje('Aplicación cargada exitosamente', 'exito');
            
            console.log('ControladorVista inicializado correctamente');
            
        } catch (error) {
            console.error(' Error al inicializar ControladorVista:', error);
            this.mostrarMensaje(`Error al inicializar: ${error.message}`, 'error');
        }
    }
}
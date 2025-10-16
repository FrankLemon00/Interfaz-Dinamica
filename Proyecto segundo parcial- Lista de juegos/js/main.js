const datosVideojuegos = [
    {
        "id": 1,
        "nombre": "Doom Eternal",
        "descripcion": "Matar demonios bien locochon con armas poderosas",
        "plataforma": "PC, PlayStation, Xbox, Nintendo Switch"
    },
    {
        "id": 2,
        "nombre": "Resident Evil 4 Remake",
        "descripcion": "Un héroe con peinado perfecto salva a la hija del presidente",
        "plataforma": "PlayStation, Xbox, PC"
    },
    {
        "id": 3,
        "nombre": "Devil May Cry 5",
        "descripcion": "Un cazador de demonios con estilo enfrenta amenazas sobrenaturales",
        "plataforma": "PlayStation, Xbox, PC"
    },
    {
        "id": 4,
        "nombre": "Pokémon Escarlata",
        "descripcion": "Atrapa a todos y conviértete en el mejor entrenador",
        "plataforma": "Nintendo Switch"
    },
    {
        "id": 5,
        "nombre": "The Last of Us Part I",
        "descripcion": "Un viaje crudo por la supervivencia y la esperanza",
        "plataforma": "PlayStation, PC"
    },
    {
        "id": 6,
        "nombre": "Sekiro: Shadows Die Twice",
        "descripcion": "Un shinobi con un solo brazo que no se rinde jamás",
        "plataforma": "PlayStation, Xbox, PC"
    },
    {
        "id": 7,
        "nombre": "Dark Souls III",
        "descripcion": "Morir es parte de la aventura en este mundo oscuro",
        "plataforma": "PlayStation, Xbox, PC"
    },
    {
        "id": 8,
        "nombre": "Bloodborne",
        "descripcion": "Enfrenta horrores cósmicos con estilo gótico",
        "plataforma": "PlayStation"
    },
    {
        "id": 9,
        "nombre": "Ghost of Tsushima",
        "descripcion": "Un samurái lucha por liberar su isla natal",
        "plataforma": "PlayStation, PC"
    },
    {
        "id": 10,
        "nombre": "Death Stranding Director's Cut",
        "descripcion": "Camina, conecta y reconstruye un mundo roto",
        "plataforma": "PlayStation, PC"
    }
];

/**
 * INICIALIZAR APLICACIÓN CUANDO EL DOM ESTÉ LISTO
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log(' DOM cargado, iniciando aplicación...');
    
    try {
        // Crear instancia del gestor
        const gestor = new GestorVideojuegos();
        console.log(' GestorVideojuegos creado');
        
        // Cargar datos iniciales
        gestor.cargarLista(datosVideojuegos);
        console.log(' Datos cargados en gestor');
        
        // Crear instancia del controlador de vista
        const controladorVista = new ControladorVista(gestor);
        console.log(' ControladorVista creado');
        
        // Inicializar la vista
        controladorVista.inicializar();
        console.log(' Aplicación inicializada correctamente');
        
        // Exponer para debugging
        window.appCRUD = {
            gestor: gestor,
            vista: controladorVista
        };
        
        console.log(' CRUD de Videojuegos listo para usar!');
        
    } catch (error) {
        console.error(' Error fatal al iniciar aplicación:', error);
        
        // Mostrar error al usuario
        const mensajeError = document.getElementById('mensaje_error');
        if (mensajeError) {
            mensajeError.textContent = 'Error crítico al cargar la aplicación. Por favor, recargue la página.';
            mensajeError.hidden = false;
        }
    }
});
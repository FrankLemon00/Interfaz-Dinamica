const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext("2d");


let trazoIniciado = false;
let figurasDibujadas = []; 
let figuraSeleccionada = null; 
let imagenParaDibujar = null; 

let puntosTrazoActual = [];
let colorRellenoSeleccionado = '#ffff00';
let colorLineaSeleccionado = '#ff0000';
let snapshot; 

const GROSOR_DEFECTO = 5;
const BORRADOR_SIZE = 30; 

let posicionCuirosor = {
    iniciales: { x: 0, y: 0 },
    actuales: { x: 0, y: 0 },
    finales: { x: 0, y: 0 }
};

// --- Funciones de Control ---

function cambiarFigura(nuevaFigura) {
    figuraSeleccionada = nuevaFigura;
    if (nuevaFigura !== 'Imagen') {
        imagenParaDibujar = null;
    }
    // Lógica para resaltar el botón activo
    document.querySelectorAll('#menu button').forEach(btn => {
        if (btn.id === `btn${nuevaFigura}`) {
            btn.classList.add('activo');
        } else {
            btn.classList.remove('activo');
        }
    });
}

function registrarPosicionCursor(event) {
    return { x: event.offsetX, y: event.offsetY };
}

function guardarSnapshot() {
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function restaurarSnapshot() {
    if (snapshot) ctx.putImageData(snapshot, 0, 0);
}

function redibujarTodo() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const figura of figurasDibujadas) {
        figura.dibujar(ctx);
    }
}

// --- Carga de Imagen ---
function cargarImagen(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                imagenParaDibujar = img;
                cambiarFigura('Imagen');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}


// --- Eventos de Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnCuadrado')?.addEventListener('click', () => cambiarFigura('Cuadrado'));
    document.getElementById('btnCirculo')?.addEventListener('click', () => cambiarFigura('Circulo'));
    document.getElementById('btnCorazon')?.addEventListener('click', () => cambiarFigura('Corazon'));
    document.getElementById('btnLinea')?.addEventListener('click', () => cambiarFigura('Linea'));
    document.getElementById('btnLapiz')?.addEventListener('click', () => cambiarFigura('Lapiz'));
    document.getElementById('btnBorrador')?.addEventListener('click', () => cambiarFigura('Borrador'));
    
    document.getElementById('fileInput')?.addEventListener('change', cargarImagen);

    document.getElementById('colorRellenoInput')?.addEventListener('input', (event) => {
        colorRellenoSeleccionado = event.target.value;
    });
    
    document.getElementById('colorLineaInput')?.addEventListener('input', (event) => {
        colorLineaSeleccionado = event.target.value;
    });

    document.getElementById('btnLimpiar')?.addEventListener('click', () => {
        figurasDibujadas = []; 
        redibujarTodo(); 
        cambiarFigura(null); 
    });
    
    // Inicializar la herramienta por defecto (Lápiz)
    cambiarFigura('Lapiz'); 
});


// --- Eventos del Canvas ---

canvas.addEventListener('mousedown', (event) => {
    if (!figuraSeleccionada) return; 
    
    posicionCuirosor.iniciales = registrarPosicionCursor(event);
    
    // --- INICIO DE LA CORRECCIÓN ---
    if (figuraSeleccionada === 'Imagen' && imagenParaDibujar) {
        
        const pos = posicionCuirosor.iniciales;
        const STICKER_SIZE = 100; 
        
        const x = pos.x - (STICKER_SIZE / 2);
        const y = pos.y - (STICKER_SIZE / 2);
        
        const sticker = new Imagen(imagenParaDibujar, x, y, STICKER_SIZE, STICKER_SIZE);
        figurasDibujadas.push(sticker);
        redibujarTodo();
        
   
        
    } else {
    // --- FIN DE LA CORRECCIÓN ---
        trazoIniciado = true;
        
        if (figuraSeleccionada === 'Lapiz' || figuraSeleccionada === 'Borrador') {
            puntosTrazoActual = [posicionCuirosor.iniciales];
        } else {
            guardarSnapshot();
        }
    }
});

canvas.addEventListener('mousemove', (event) => {
    if (!trazoIniciado) return;

    posicionCuirosor.actuales = registrarPosicionCursor(event);
    const actual = posicionCuirosor.actuales;
    const inicio = posicionCuirosor.iniciales;
    let figuraPrevisual;

    if (figuraSeleccionada === 'Lapiz' || figuraSeleccionada === 'Borrador') {
        
        puntosTrazoActual.push(actual);
        
        const isEraser = figuraSeleccionada === 'Borrador';
        ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
        ctx.strokeStyle = isEraser ? '#000000' : colorLineaSeleccionado;
        ctx.lineWidth = isEraser ? BORRADOR_SIZE : GROSOR_DEFECTO;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        
        if (puntosTrazoActual.length >= 2) {
            const last = puntosTrazoActual.length - 1;
            ctx.beginPath();
            ctx.moveTo(puntosTrazoActual[last - 1].x, puntosTrazoActual[last - 1].y);
            ctx.lineTo(puntosTrazoActual[last].x, puntosTrazoActual[last].y);
            ctx.stroke();
        }
        
        ctx.globalCompositeOperation = 'source-over'; 
        
    } else { 
        
        restaurarSnapshot(); 

        const w = actual.x - inicio.x;
        const h = actual.y - inicio.y;
        
        const rellenoPreview = "rgba(128, 128, 128, 0.4)"; 

        if (figuraSeleccionada === 'Cuadrado') {
            const x = Math.min(inicio.x, actual.x);
            const y = Math.min(inicio.y, actual.y);
            const ancho = Math.abs(w);
            const alto = Math.abs(h);
            
            figuraPrevisual = new Cuadrado(x, y, ancho, alto, colorLineaSeleccionado, rellenoPreview, GROSOR_DEFECTO);
            
        } else if (figuraSeleccionada === 'Circulo') {
            const radio = Math.hypot(w, h); 
            figuraPrevisual = new Circulo(inicio.x, inicio.y, radio, colorLineaSeleccionado, rellenoPreview, GROSOR_DEFECTO);
            
        } else if (figuraSeleccionada === 'Corazon') {
            const tamano = Math.hypot(w, h) / 3; 
            figuraPrevisual = new Corazon(inicio.x, inicio.y, tamano, colorLineaSeleccionado, rellenoPreview, GROSOR_DEFECTO);
            
        } else if (figuraSeleccionada === 'Linea') {
            figuraPrevisual = new Linea(inicio.x, inicio.y, actual.x, actual.y, colorLineaSeleccionado, GROSOR_DEFECTO);
        }
        
        if (figuraPrevisual) {
            figuraPrevisual.dibujar(ctx);
        }
    }
});

canvas.addEventListener('mouseup', (event) => {
    if (!trazoIniciado) return;
    trazoIniciado = false;
    posicionCuirosor.finales = registrarPosicionCursor(event);

    const inicio = posicionCuirosor.iniciales;
    const final = posicionCuirosor.finales;
    const w = final.x - inicio.x;
    const h = final.y - inicio.y;
    let figura;
    
    
    if (figuraSeleccionada === 'Cuadrado') {
        const x = Math.min(inicio.x, final.x);
        const y = Math.min(inicio.y, final.y);
        const ancho = Math.abs(w);
        const alto = Math.abs(h);
        
        figura = new Cuadrado(x, y, ancho, alto, colorLineaSeleccionado, colorRellenoSeleccionado, GROSOR_DEFECTO);
        
    } else if (figuraSeleccionada === 'Circulo') {
        const radio = Math.hypot(w, h);
        figura = new Circulo(inicio.x, inicio.y, radio, colorLineaSeleccionado, colorRellenoSeleccionado, GROSOR_DEFECTO);
        
    } else if (figuraSeleccionada === 'Corazon') {
        const tamano = Math.hypot(w, h) / 3;
        figura = new Corazon(inicio.x, inicio.y, tamano, colorLineaSeleccionado, colorRellenoSeleccionado, GROSOR_DEFECTO);
        
    } else if (figuraSeleccionada === 'Linea') {
        figura = new Linea(inicio.x, inicio.y, final.x, final.y, colorLineaSeleccionado, GROSOR_DEFECTO);
        
    } else if (figuraSeleccionada === 'Lapiz') { 
        if (puntosTrazoActual.length > 1) {
            figura = new Lapiz(colorLineaSeleccionado, GROSOR_DEFECTO, puntosTrazoActual);
        }
        
    } else if (figuraSeleccionada === 'Borrador') {
        return; 
    }
    
    if (figura) {
        figurasDibujadas.push(figura);
    }
    
    snapshot = null; 
    redibujarTodo(); 
    puntosTrazoActual = [];
});
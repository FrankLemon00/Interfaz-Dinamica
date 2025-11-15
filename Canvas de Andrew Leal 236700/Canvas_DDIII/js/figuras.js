class Figura {
    constructor(posicionX, posicionY, colorLinea, colorRelleno, grosorLinea) {
        this.colorLinea = colorLinea;
        this.colorRelleno = colorRelleno;
        this.grosorLinea = grosorLinea;
        this.posicionX = posicionX;
        this.posicionY = posicionY;
    }
}

class Cuadrado extends Figura {
    constructor(posicionX, posicionY, ancho, alto, colorLinea, colorRelleno, grosorLinea) {
        super(posicionX, posicionY, colorLinea, colorRelleno, grosorLinea);
        this.ancho = ancho;
        this.alto = alto;
    }
    
    dibujar(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = this.colorLinea;
        ctx.fillStyle = this.colorRelleno;
        ctx.lineWidth = this.grosorLinea;
        ctx.fillRect(this.posicionX, this.posicionY, this.ancho, this.alto);
        ctx.strokeRect(this.posicionX, this.posicionY, this.ancho, this.alto);
    }
}

class Circulo extends Figura {
    constructor(posicionX, posicionY, radio, colorLinea, colorRelleno, grosorLinea) {
        super(posicionX, posicionY, colorLinea, colorRelleno, grosorLinea);
        this.radio = radio;
    }
    
    dibujar(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = this.colorLinea;
        ctx.fillStyle = this.colorRelleno;
        ctx.lineWidth = this.grosorLinea;
        ctx.arc(this.posicionX, this.posicionY, this.radio, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
}

class Linea extends Figura {
    constructor(posicionX, posicionY, puntoFinalX, puntoFinalY, colorLinea, grosorLinea) {
        super(posicionX, posicionY, colorLinea, null, grosorLinea);
        this.puntoFinalX = puntoFinalX;
        this.puntoFinalY = puntoFinalY;
    }
    
    dibujar(ctx) {
        ctx.beginPath();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = this.colorLinea;
        ctx.lineWidth = this.grosorLinea;
        ctx.moveTo(this.posicionX, this.posicionY);
        ctx.lineTo(this.puntoFinalX, this.puntoFinalY);
        ctx.stroke();
    }
}

class Corazon extends Figura {
    constructor(posicionX, posicionY, tamano, colorLinea, colorRelleno, grosorLinea) {
        super(posicionX, posicionY, colorLinea, colorRelleno, grosorLinea);
        this.tamano = tamano;
    }
    
    dibujar(ctx) {
        ctx.save();
        const x = this.posicionX;
        const y = this.posicionY;
        const s = this.tamano * 0.5;

        ctx.beginPath();
        ctx.strokeStyle = this.colorLinea;
        ctx.fillStyle = this.colorRelleno;
        ctx.lineWidth = this.grosorLinea;
        
        ctx.moveTo(x, y + 0.5 * s);
        ctx.bezierCurveTo(x + s, y - s * 0.5, x + s * 1.5, y - s * 2, x, y - s * 3);
        ctx.bezierCurveTo(x - s * 1.5, y - s * 2, x - s, y - s * 0.5, x, y + 0.5 * s);
        
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}

class Imagen extends Figura {
    constructor(imgElement, x, y, width, height) {
        super(x, y, 'black', null, 1);
        this.imgElement = imgElement;
        this.width = width;
        this.height = height;
    }

    dibujar(ctx) {
        ctx.drawImage(this.imgElement, this.posicionX, this.posicionY, this.width, this.height);
    }
}

class Lapiz {
    constructor(colorLinea, grosorLinea, puntos) {
        this.colorLinea = colorLinea;
        this.grosorLinea = grosorLinea;
        this.puntos = puntos || []; 
    }

    dibujar(ctx) {
        if (this.puntos.length < 1) return;

        ctx.beginPath();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = this.colorLinea;
        ctx.lineWidth = this.grosorLinea;

        ctx.moveTo(this.puntos[0].x, this.puntos[0].y);
        
        for (let i = 1; i < this.puntos.length; i++) {
            ctx.lineTo(this.puntos[i].x, this.puntos[i].y);
        }
        ctx.stroke();
    }
}
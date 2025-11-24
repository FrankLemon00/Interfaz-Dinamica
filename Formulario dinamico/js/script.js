const elementos = document.querySelector("#elementos"); // Importante: Se asume que este elemento existe en el HTML

function CrearImagen(event) {
    console.log(event.target.value);
    elementos.innerHTML = "";

    for (let i = 0; i < event.target.value; i++) {
        const tarj = document.createElement("div");
        const imagen = new Image();
        const titulo = document.createElement("h3"); // Cambié a h3 para consistencia
        const text = document.createElement("p");
        const prec = document.createElement("p"); // Cambié a p para consistencia con price
        const boton = document.createElement("button");
        
        // Clases ajustadas para estilo Pokémon (product-card)
        tarj.classList.add("product-card", "poke-item"); 
        imagen.src = "../recursos/placeholder-imagen2.webp";
        imagen.classList.add("product-image");

        titulo.classList.add("product-name");
        titulo.textContent = "Producto Generado " + (i + 1);
        text.classList.add("product-description");
        text.textContent = "Pokébola Básica, la herramienta esencial para cualquier entrenador Pokémon.";
        prec.classList.add("product-price"); // Clase ajustada
        prec.textContent = "$50.00"; // Mejor formato
        boton.classList.add("btn", "poke-btn-primary", "add-to-cart-btn"); // Clases de estilo Pokémon
        boton.innerHTML = '<i class="fas fa-shopping-bag"></i> Comprar';

        elementos.appendChild(tarj);
        tarj.appendChild(imagen);
        
        // Contenedor de detalles para mejorar la estructura
        const details = document.createElement("div");
        details.classList.add("product-details");
        details.appendChild(titulo);
        details.appendChild(text);
        details.appendChild(prec);
        details.appendChild(boton);

        tarj.appendChild(details);
    }
}
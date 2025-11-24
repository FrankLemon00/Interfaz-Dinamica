//Variables globales
const formulario_producto_nuevo = document.querySelector("#formulario_producto_nuevo");
const elementos = document.querySelector("#elementos"); // Aseguramos que elementos esté disponible
let productos = [];
let srcImagenProd = "";
let formOcu = false; //El formulario inicia oculto

//Clase Producto
class Producto {
    constructor(id, imagen, nombre, descripcion, precio) {
        this.Id = id;
        this.Imagen = imagen;
        this.Nombre = nombre;
        this.Descripcion = descripcion;
        this.Precio = precio;
    }

    ObtenerDatos() {
        console.log("ID:", this.Id);
        console.log("Imagen:", this.Imagen);
        console.log("Nombre:", this.Nombre);
        console.log("Descripción:", this.Descripcion);
        console.log("Precio:", this.Precio);
    }
}

//Funcion para agregar producto
function AgregarProducto(event) {
    event.preventDefault();

    let lectorFormulario = new FormData(formulario_producto_nuevo);
    const datos = Object.fromEntries(lectorFormulario.entries());

    if (datos.Nombre !== "" && datos.Descripcion !== "" && datos.Precio != null && srcImagenProd !== "") {
        //Crear producto y guardarlo en un objeto
        const nuevoProducto = new Producto(
            productos.length + 1,
            srcImagenProd,
            datos.Nombre,
            datos.Descripcion,
            datos.Precio
        );
        productos.push(nuevoProducto);

        //Mostrarlo en consola
        nuevoProducto.ObtenerDatos();

        //Crear elemento en la interfaz (Se usan clases genéricas para aplicar el estilo Pokémon)
        const tarj = document.createElement("div");
        tarj.classList.add("product-card", "poke-item"); // Nueva clase para estilo

        const imagen = new Image();
        imagen.src = nuevoProducto.Imagen;
        imagen.classList.add("product-image"); // Nueva clase

        const tarContent = document.createElement("div");
        tarContent.classList.add("product-details"); // Nueva clase

        const titulo = document.createElement("h3");
        titulo.classList.add("product-name"); // Nueva clase
        titulo.textContent = nuevoProducto.Nombre;

        const text = document.createElement("p");
        text.classList.add("product-description"); // Nueva clase
        text.textContent = nuevoProducto.Descripcion;

        const precio = document.createElement("p");
        precio.classList.add("product-price"); // Nueva clase
        precio.textContent = "$" + nuevoProducto.Precio;

        const boton = document.createElement("button");
        boton.classList.add("btn", "poke-btn-primary", "add-to-cart-btn"); // Clases de estilo Pokémon
        boton.innerHTML = '<i class="fas fa-shopping-cart"></i> Comprar';

        // Se agregan los elementos al DOM del html
        elementos.appendChild(tarj);
        tarj.appendChild(imagen);
        tarj.appendChild(tarContent);
        tarContent.appendChild(titulo);
        tarContent.appendChild(text);
        tarContent.appendChild(precio);
        tarContent.appendChild(boton);

        // Resetear formulario
        formulario_producto_nuevo.reset();
        // Nota: Se corrigió la ruta de la imagen placeholder
        document.querySelector("#imgFile").src = "../recursos/image-placeholder.png"; 
        srcImagenProd = "";

        // Mostrar notificación
        alert("✅ Producto agregado correctamente a la lista.");
    } else {
        alert("❌ ¡Faltan datos! Por favor, completa todos los campos y agrega una imagen.");
    }
}

// Función para obtener imagen
function obtenerImagen(event) {
    const file = event.target.files[0];
    console.log(file);

    if (file && (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/webp")) {
        console.log(file.name);
        const lector = new FileReader();
        lector.onload = (event) => {
            srcImagenProd = event.target.result;
            document.querySelector("#imgFile").src = srcImagenProd;
        };
        lector.readAsDataURL(file);
    } else {
        alert("Por favor, selecciona una imagen válida (JPEG, PNG o WEBP)");
    }
}

//Función para ocultar/mostrar formulario
function ocultarformulario() {
    const formulario = document.querySelector("#contenedor_formulario_producto_nuevo");
    const toggleBtn = document.querySelector(".toggle-form-btn i");

    //Detectar visibilidad 
    const visible = window.getComputedStyle(formulario).display !== "none";

    if (visible) {
        formulario.style.display = "none";
        toggleBtn.classList.remove("fa-times");
        toggleBtn.classList.add("fa-plus");
        formOcu = false;
    } else {
        formulario.style.display = "block";
        toggleBtn.classList.remove("fa-plus");
        toggleBtn.classList.add("fa-times");
        formOcu = true;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#contenedor_formulario_producto_nuevo").style.display = "none";
    formOcu = false;

    // Único evento
    document.querySelector(".toggle-form-btn").addEventListener("click", ocultarformulario);
});
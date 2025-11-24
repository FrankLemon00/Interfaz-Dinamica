// URL base de la PokeAPI
const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2/pokemon";
// MODIFICACIÓN CLAVE: Aumentamos el límite a 151 para incluir la primera generación
const INITIAL_LIMIT = 151; 
let nextUrl = null;
let prevUrl = null;

// Función auxiliar para capitalizar el nombre
function capitalize(s) {
    if (!s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
}

// Cargar Pokemon al iniciar la pagina
document.addEventListener("DOMContentLoaded", function () {
    cargarPokemones();
});

// Funcion para cargar Pokemon
function cargarPokemones(urlOverride) { // Acepta una URL opcional para paginación
    // Usamos el límite inicial si no hay una URL de paginación proporcionada
    const url = urlOverride || nextUrl || POKEAPI_BASE_URL + `?limit=${INITIAL_LIMIT}`; 

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("✅ Conexión exitosa a PokeAPI! Cargando los primeros " + INITIAL_LIMIT + " Pokémon.");

            // Actualizar URLs de paginacion
            nextUrl = data.next;
            prevUrl = data.previous;

            // Crear array de promesas para obtener detalles de cada Pokémon
            const pokemonPromises = data.results.map(pokemon =>
                fetch(pokemon.url)
                    .then(res => res.json())
            );
            
            // Esperar a que todas las promesas se resuelvan
            return Promise.all(pokemonPromises);
        })
        .then(pokemonesDetalles => {
            // Mostrar Pokémon en la interfaz
            mostrarPokemones(pokemonesDetalles);
        })
        .catch(error => {
            console.error("❌ Error en PokeAPI:", error.message);
            document.getElementById("pokemon-container").innerHTML =
                `<div class="error-message">Error al cargar los Pokémon: ${error.message}. ¡El Team Rocket está saboteando la conexión!</div>`;
        });
}

// Funcion para mostrar Pokemon en la interfaz
function mostrarPokemones(pokemones) {
    const container = document.getElementById("pokemon-container");
    container.innerHTML = "";

    pokemones.forEach(pokemon => {
        const pokemonCard = document.createElement("div");
        pokemonCard.classList.add("pokemon-card"); 
        
        // Obtener tipos del Pokémon y poner la primera letra en mayúscula
        const types = pokemon.types.map(typeInfo => capitalize(typeInfo.type.name));

        // Filtro para incluir solo las evoluciones que pediste y sus pre-evoluciones
        // NOTA: Con INITIAL_LIMIT = 151, ya todos están incluidos, no necesitamos un filtro tan estricto aquí,
        // pero podemos usar la lógica si quisiéramos filtrar solo los que pides,
        // aunque el diseño actual de tu Pokédex espera mostrar todos los que se cargan.

        pokemonCard.innerHTML = `
            <span class="pokemon-id">#${String(pokemon.id).padStart(3, '0')}</span>
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" class="pokemon-image">
            <div class="pokemon-details">
                <h3 class="pokemon-name">${capitalize(pokemon.name)}</h3>
                <div class="pokemon-types">
                    ${types.map(type => `<span class="type-badge type-${type.toLowerCase()}">${type}</span>`).join('')}
                </div>
            </div>
            <button class="add-to-cart-btn"><i class="fas fa-shopping-bag"></i> Añadir</button> 
        `;

        container.appendChild(pokemonCard);
    });
}

//Función para cargar más Pokemon (paginacion)
function cargarMasPokemon() {
    if (nextUrl) {
        cargarPokemones(nextUrl);
    }
}
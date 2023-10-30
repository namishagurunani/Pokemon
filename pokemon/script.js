const typeFilter = document.getElementById("type-filter");
const resetButton = document.getElementById("reset-button");
const searchInput = document.getElementById("search-input");
const pokedex = document.getElementById("pokedex");
const noResults = document.getElementById("no-results");

let pokemonsData = [];

// Function to fetch Pokémon data from the API
async function fetchPokemonData() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
    const data = await response.json();
    const pokemons = data.results;
    for (const pokemon of pokemons) {
      const pokemonData = await fetch(pokemon.url).then((res) => res.json());
      pokemonsData.push(pokemonData);
    }
    createPokemonCards(pokemonsData);
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
  }
}

// Function to create Pokémon cards
function createPokemonCards(pokemons) {
  pokedex.innerHTML = "";
  pokemons.forEach((pokemon) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const name = document.createElement("h3");
    name.textContent = pokemon.name;

    const image = document.createElement("img");
    image.src = pokemon.sprites.front_default;
    image.alt = pokemon.name;

    const types = document.createElement("p");
    types.textContent = "Type(s): " + pokemon.types.map((type) => type.type.name).join(", ");

    card.appendChild(name);
    card.appendChild(image);
    card.appendChild(types);

    pokedex.appendChild(card);
  });
}

// Function to handle type filtering
typeFilter.addEventListener("change", () => {
  const selectedType = typeFilter.value.toLowerCase();

  if (selectedType === "all") {
    createPokemonCards(pokemonsData);
  } else {
    const filtered = pokemonsData.filter((pokemon) =>
      pokemon.types.some((type) => type.type.name === selectedType)
    );
    createPokemonCards(filtered);
  }
});

// Function to reset filters
resetButton.addEventListener("click", () => {
  typeFilter.value = "all";
  createPokemonCards(pokemonsData);
  searchInput.value = "";
});

// Function to handle search as you type
searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();
  const matchingPokemons = pokemonsData.filter((pokemon) =>
    pokemon.name.includes(searchTerm)
  );

  if (searchTerm === "") {
    createPokemonCards(pokemonsData);
  } else {
    createPokemonCards(matchingPokemons);
  }
});

// Initialize the app
fetchPokemonData();

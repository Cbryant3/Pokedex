const pokemonInfo = document.getElementById("pokemonInfo");
const searchBtn = document.getElementById("searchBtn");
const pokemonInput = document.getElementById("pokemonInput");

// Fetch Pokémon data from your Flask backend
async function getPokemonData(name) {
  const url = `http://127.0.0.1:5000/api/pokemon/${name.toLowerCase()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Pokémon not found");

    const data = await response.json();
    displayPokemonInfo(data);
  } catch (error) {
    pokemonInfo.innerHTML = `<p class="error">❌ ${error.message}</p>`;
  }
}

// Display Pokémon info dynamically
function displayPokemonInfo(data) {
  const moves = data.moves.slice(0, 10).join(", ");
  const artwork = data.official_artwork?.default || data.sprites?.default || "";

  pokemonInfo.innerHTML = `
    <div class="pokemon-card">
      <h2>${data.name} (#${data.id})</h2>
      <img src="${artwork}" alt="${data.name}" class="pokemon-img">

      <p><strong>Type(s):</strong> ${data.types.join(", ")}</p>
      <p><strong>Abilities:</strong> ${data.abilities.join(", ")}</p>
      <p><strong>Height:</strong> ${(data.height / 10).toFixed(1)} m</p>
      <p><strong>Weight:</strong> ${(data.weight / 10).toFixed(1)} kg</p>
      <p><strong>Top Moves:</strong> ${moves}...</p>

      <audio controls>
        <source src="${data.cry}" type="audio/mpeg">
        Your browser does not support audio playback.
      </audio>

      <h3>Stats</h3>
      <ul>
        ${Object.entries(data.stats)
          .map(([key, value]) => `<li>${key.toUpperCase()}: ${value}</li>`)
          .join("")}
      </ul>
    </div>
  `;
}

// Search button click event
searchBtn.addEventListener("click", () => {
  const name = pokemonInput.value.trim();
  if (name) {
    getPokemonData(name);
  } else {
    pokemonInfo.innerHTML = `<p class="error">Please enter a Pokémon name.</p>`;
  }
});

// Allow "Enter" key to trigger search
pokemonInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

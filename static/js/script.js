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

let statsChartInstance = null; // prevent overlapping charts

// Display Pokémon info dynamically
function displayPokemonInfo(data) {
  const moves = data.moves.slice(0, 10).join(", ");

  pokemonInfo.innerHTML = `
    <div class="pokemon-card">
      <h2>${data.name} (#${data.id})</h2>

      <div class="artwork-section">
        <h3>Official Artwork</h3>
        <img src="${data.official_artwork.default}" alt="${data.name}" class="pokemon-img">
        <img src="${data.official_artwork.shiny}" alt="${data.name} Shiny" class="pokemon-img">
      </div>

      <div class="sprite-section">
        <h3>Sprites</h3>
        <img src="${data.sprites.default}" alt="${data.name} Sprite" class="pokemon-sprite">
        <img src="${data.sprites.shiny}" alt="${data.name} Shiny Sprite" class="pokemon-sprite">
      </div>

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
      <!-- Radar Chart -->
      <canvas id="statsChart" width="300" height="300"></canvas>
    </div>
  `;

  const canvas = document.getElementById('statsChart');
  if (!canvas) {
    console.error("Stats chart canvas not found!");
    return;
  }

  const ctx = canvas.getContext('2d');
  const labels = Object.keys(data.stats).map(stat => stat.toUpperCase());
  const statsData = Object.values(data.stats);

  if (statsChartInstance) {
    statsChartInstance.destroy();
  }

  statsChartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [{
        label: `${data.name}'s Stats`,
        data: statsData,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      //maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true,
          ticks: {
            showLabelBackdrop: false
          }
        }
      }
    },
    plugins: [{
      id: 'statLabels',
      afterDatasetsDraw(chart) {
        const { ctx } = chart;
        chart.data.datasets.forEach((dataset, i) => {
          const meta = chart.getDatasetMeta(i);
          meta.data.forEach((point, index) => {
            const value = dataset.data[index];
            ctx.save();
            ctx.fillStyle = 'black';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const { x, y } = point.tooltipPosition();
            ctx.fillText(value, x, y - 10); // Position above point
            ctx.restore();
          });
        });
      }
    }]
  });
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

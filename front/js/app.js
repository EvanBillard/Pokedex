document.addEventListener("DOMContentLoaded", async () => {
    const pokemonList = document.getElementById("pokemon-list");
    const prevBtns = document.querySelectorAll(".prev-btn"); 
    const nextBtns = document.querySelectorAll(".next-btn");
    const token = localStorage.getItem("token");
    let pkmnCatch = [];
    let pokemons = [];
    let currentPage = 0;
    const pageSize = 20;

    try {
        if (token) {
            const trainerResponse = await fetch("http://localhost:3000/api/trainer/me/pokedex", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (trainerResponse.ok) {
                const trainerData = await trainerResponse.json();
                pkmnCatch = trainerData.pkmnCatch;
                console.log("Pokémon capturés :", pkmnCatch);
            } else {
                console.warn("Impossible de récupérer les Pokémon capturés.");
            }
        }

        const response = await fetch("http://localhost:3000/api/pokemon");
        if (!response.ok) throw new Error("Erreur lors de la récupération des Pokémon");

        pokemons = await response.json();
        updatePagination();

    } catch (error) {
        console.error(error);
        pokemonList.innerHTML = "<p>Erreur lors du chargement des Pokémon.</p>";
    }

    function renderPokemons() {
        pokemonList.innerHTML = "";
        const start = currentPage * pageSize;
        const end = start + pageSize;
        const paginatedPokemons = pokemons.slice(start, end);

        paginatedPokemons.forEach(pokemon => {
            const pokemonCard = document.createElement("div");
            pokemonCard.classList.add("pokemon-card");

            if (pkmnCatch.includes(pokemon.name)) {
                pokemonCard.classList.add("captured");
            }

            pokemonCard.innerHTML = `
                <h3>${pokemon.name}</h3>
                <img src="${pokemon.imgUrl}" alt="${pokemon.name}">
                <p>${pokemon.types.join(" ")}</p>
            `;

            pokemonList.appendChild(pokemonCard);
        });
    }

    function updatePagination() {
        renderPokemons();
        
        prevBtns.forEach(btn => btn.style.display = currentPage === 0 ? "none" : "inline-block");
        nextBtns.forEach(btn => btn.style.display = (currentPage + 1) * pageSize >= pokemons.length ? "none" : "inline-block");
    }

    prevBtns.forEach(btn => btn.addEventListener("click", () => {
        if (currentPage > 0) {
            currentPage--;
            updatePagination();
        }
    }));

    nextBtns.forEach(btn => btn.addEventListener("click", () => {
        if ((currentPage + 1) * pageSize < pokemons.length) {
            currentPage++;
            updatePagination();
        }
    }));
});

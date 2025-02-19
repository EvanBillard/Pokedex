document.addEventListener("DOMContentLoaded", async () => {
    const pokemonList = document.getElementById("pokemon-list");

    try {
        // console.log("Tentative de fetch des Pokémon...");
        const response = await fetch("http://localhost:3000/api/pokemon");
        // console.log(response)
        if (!response.ok) throw new Error("Erreur lors de la récupération des Pokémon");

        const pokemons = await response.json();

        pokemons.forEach(pokemon => {
            const pokemonCard = document.createElement("div");
            pokemonCard.classList.add("pokemon-card");
            

            pokemonCard.innerHTML = `
                <img src="${pokemon.imgUrl}" alt="${pokemon.name}">
                <h3>${pokemon.name}</h3>
                <p>${pokemon.types.join(" ")}</p>
            `;

            pokemonList.appendChild(pokemonCard);

        });

    } catch (error) {
        console.error(error);
        pokemonList.innerHTML = "<p>Erreur lors du chargement des Pokémon.</p>";
    }
});

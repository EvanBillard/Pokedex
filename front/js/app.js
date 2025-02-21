document.addEventListener("DOMContentLoaded", async () => {
    const pokemonList = document.getElementById("pokemon-list");
    const token = localStorage.getItem("token");
    let pkmnCatch = []; // Stocke les Pokémon capturés

    try {
        // 🔹 Si l'utilisateur est connecté, récupérer son Pokédex
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
                pkmnCatch = trainerData.pkmnCatch; // Liste des Pokémon capturés
                console.log("Pokémon capturés :", pkmnCatch);
            } else {
                console.warn("Impossible de récupérer les Pokémon capturés.");
            }
        }

        // 🔹 Récupération de tous les Pokémon
        const response = await fetch("http://localhost:3000/api/pokemon");
        if (!response.ok) throw new Error("Erreur lors de la récupération des Pokémon");

        const pokemons = await response.json();

        // 🔹 Affichage des Pokémon
        pokemons.forEach(pokemon => {
            const pokemonCard = document.createElement("div");
            pokemonCard.classList.add("pokemon-card");

            // Vérifie si le Pokémon est capturé
            if (pkmnCatch.includes(pokemon.name)) {
                pokemonCard.classList.add("captured"); // Ajoute une classe spéciale
            }

            pokemonCard.innerHTML = `
                <h3>${pokemon.name}</h3>
                <img src="${pokemon.imgUrl}" alt="${pokemon.name}">
                <p>${pokemon.types.join(" ")}</p>
            `;

            pokemonList.appendChild(pokemonCard);
        });

    } catch (error) {
        console.error(error);
        pokemonList.innerHTML = "<p>Erreur lors du chargement des Pokémon.</p>";
    }
});

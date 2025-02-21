document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("token");

    console.log("Token récupéré : ", token);

    if (!token) {
        alert("Vous devez être connecté pour voir votre Pokédex !");
        window.location.href = "index.html";
        return;
    }

    try {
        console.log("Tentative de récupération du Pokédex...");

        const response = await fetch("http://localhost:3000/api/trainer/me/pokedex", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        console.log("Réponse du serveur : ", response);

        if (!response.ok) {
            console.error("Erreur HTTP : ", response.status);
            throw new Error("Erreur lors de la récupération du Pokédex");
        }

        const { pkmnSeen, pkmnCatch } = await response.json();
        console.log("Données récupérées : ", { pkmnSeen, pkmnCatch });

        //Récupération de tous les Pokémon disponibles
        const pokemonsResponse = await fetch("http://localhost:3000/api/pokemon");
        const allPokemons = await pokemonsResponse.json();
        console.log("Tous les Pokémon disponibles : ", allPokemons);

        const pokedexContainer = document.getElementById("pokedex-container");
        pokedexContainer.innerHTML = ""; // Nettoyage avant affichage

        //Affichage des Pokémon vus dans le Pokédex
        pkmnSeen.forEach(pokemon => {
            console.log("Pokémon en cours d'affichage : ", pokemon);

            const isCaptured = pkmnCatch.includes(pokemon);
            const pokemonData = allPokemons.find(p => p.name === pokemon);

            if (pokemonData) {
                const pokemonElement = document.createElement("div");
                pokemonElement.classList.add("pokemon-card");

                if (isCaptured) {
                    pokemonElement.classList.add("captured"); // Ajoute une classe si capturé
                }

                pokemonElement.innerHTML = `
                    <h3>${pokemonData.name}</h3>
                    <img src="${pokemonData.imgUrl}" alt="${pokemonData.name}">
                    <p>${pokemonData.types.join(" ")}</p>
                `;

                pokedexContainer.appendChild(pokemonElement);
            } else {
                console.error(`Données non trouvées pour le Pokémon : ${pokemon}`);
            }
        });

    } catch (error) {
        console.error("Erreur lors du chargement du Pokédex :", error);
        alert("Impossible de récupérer votre Pokédex.");
    }
});

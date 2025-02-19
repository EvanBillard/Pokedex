document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Vous devez être connecté pour voir votre Pokédex !");
        window.location.href = "index.html"; // Rediriger si non connecté
        return;
    }

    try {
        // 🔹 Récupération du Pokédex du dresseur
        console.log(token);

        const response = await fetch("http://localhost:3000/api/trainer/me/pokedex", {
            method: "GET",
            headers: {
                "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2FlZmFiYTBhYzBmZTVlNGRlYWZkZGUiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Mzk5NzUwNDksImV4cCI6MTczOTk3ODY0OX0.vQwW1U0c0Vvn9SNRsQgY_fGLNRJjuGdeXIJRbRJE22Y`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error("Erreur lors de la récupération du Pokédex");

        const { pkmnSeen, pkmnCatch } = await response.json();

        const pokedexContainer = document.getElementById("pokedex-container");
        pokedexContainer.innerHTML = ""; // Nettoyer avant d'afficher

        // 🔹 Affichage des Pokémon vus
        pkmnSeen.forEach(pokemon => {
            const isCaptured = pkmnCatch.includes(pokemon);
            const pokemonElement = document.createElement("div");
            pokemonElement.classList.add("pokemon-card");

            pokemonElement.innerHTML = `
                <p>${pokemon} ${isCaptured ? '<span class="captured">(Capturé)</span>' : ''}</p>
            `;

            pokedexContainer.appendChild(pokemonElement);
        });

    } catch (error) {
        console.error("Erreur lors du chargement du Pokédex :", error);
        alert("Impossible de récupérer votre Pokédex.");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("inscriptionForm");

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Empêche le rechargement de la page

        const firstName = document.getElementById("prenom").value.trim();
        const lastName = document.getElementById("nom").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const password2 = document.getElementById("password2").value;

      
        if (password !== password2) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ firstName, lastName, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Erreur lors de l'inscription");
            }

            //Stocker le token dans le localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

           
            updateNav();

          
            window.location.href = "index.html";

        } catch (error) {
            console.error("Erreur:", error);
            alert(error.message);
        }
    });

    function updateNav() {
        const token = localStorage.getItem("token");
        const loginBtn = document.getElementById("login-btn");
        const logoutBtn = document.getElementById("logout-btn");
        const pokedexLink = document.getElementById("pokedex-link");

        if (token) {
            loginBtn.style.display = "none";
            logoutBtn.style.display = "block";
            pokedexLink.style.display = "block";
        }
    }
});

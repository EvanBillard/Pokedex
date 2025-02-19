document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const pokedexLink = document.getElementById('pokedex-link');

    // Vérifier si un token est stocké pour ajuster l'affichage
    function updateUI() {
        const token = localStorage.getItem('token');

        if (token) {
            // Utilisateur connecté
            if (loginBtn) loginBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'block';
            if (pokedexLink) pokedexLink.style.display = 'block';
        } else {
            // Utilisateur non connecté
            if (loginBtn) loginBtn.style.display = 'block';
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (pokedexLink) pokedexLink.style.display = 'none';
        }
    }

    // Gestion de la connexion
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Données reçues :', data);

                if (data.token) {
                    localStorage.setItem('token', data.token);
                    window.location.href = 'index.html'; // Redirection après connexion
                } else {
                    alert('Erreur de connexion : ' + data.message);
                }
            })
            .catch(error => {
                console.error('Erreur lors de la connexion:', error);
                alert('Une erreur est survenue. Veuillez réessayer plus tard.');
            });
        });
    }

    // Gestion de la déconnexion
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            localStorage.removeItem('token'); // Supprimer le token
            updateUI(); // Mettre à jour l'affichage
            window.location.href = 'index.html'; // Redirection après déconnexion
        });
    }

    // Mise à jour de l'UI au chargement de la page
    updateUI();
});

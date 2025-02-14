const express = require("express");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth.routes");
const pokemonRoutes = require("./routes/pokemon.routes");
const pkmnTypeRoutes = require("./routes/pkmnType.routes");

const { isAuthenticated } = require("./middlewares/auth.middleware");

const PORT = 3000;
const MONGO_URI = "mongodb://127.0.0.1:27017/td";

const app = express();
app.use(express.json());

// 🔹 Connexion à MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((err) => {
    console.error("Erreur de connexion MongoDB :", err);
    process.exit(1); // Arrête le serveur en cas d'erreur critique
  });

// 🔹 Routes
app.use("/api/auth", authRoutes);
app.use("/api/pokemon", isAuthenticated, pokemonRoutes);
app.use("/api/pkmn", pkmnTypeRoutes); // Protégé par authentification

// 🔹 Gestion d'erreur globale
app.use((err, req, res, next) => {
  console.error("Erreur serveur :", err);
  res.status(500).json({ message: "Une erreur interne est survenue." });
});

// 🔹 Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});

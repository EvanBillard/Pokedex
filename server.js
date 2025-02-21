const express = require("express");
const mongoose = require("mongoose");



const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const pokemonRoutes = require("./routes/pokemon.routes");
const pkmnTypeRoutes = require("./routes/pkmnType.routes");
const trainerRoutes = require("./routes/trainer.routes");

const { isAuthenticated } = require("./middlewares/auth.middleware");

const PORT = 3000;
const MONGO_URI = "mongodb://127.0.0.1:27017/td";

const app = express();
app.use(express.json());


const cors = require('cors');
app.use(cors());

//Connexion à MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((err) => {
    console.error("Erreur de connexion MongoDB :", err);
    process.exit(1); // Arrête le serveur en cas d'erreur critique
  });

//Routes
app.use("/api/auth", authRoutes); 
app.use("/api/pokemon", pokemonRoutes); 
app.use("/api/pkmn", pkmnTypeRoutes); 
app.use("/api/users", userRoutes);
app.use("/api/trainer", isAuthenticated, trainerRoutes); 

//Gestion d'erreurs
app.use((err, req, res, next) => {
  console.error("Erreur serveur :", err);
  // Si l'erreur est une instance de MongoDB, gérer spécifiquement
  if (err.name === 'MongoError') {
    return res.status(500).json({ message: 'Erreur de base de données', error: err.message });
  }
  res.status(500).json({ message: "Une erreur interne est survenue." });
});

//Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});

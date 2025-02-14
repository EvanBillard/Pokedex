const express = require("express");
const pkmnTypeRoutes = require("./routes/pkmnType.routes");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/api/pkmn", pkmnTypeRoutes);

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});


const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/td')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.log(err));

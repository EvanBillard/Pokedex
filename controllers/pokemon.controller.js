const Pokemon = require("../models/pokemon.model");

exports.createPokemon = async (req, res) => {
  try {
    // Vérifie que l'utilisateur est admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Accès refusé : vous n'êtes pas admin." });
    }

    const { name, type, level } = req.body;

    const newPokemon = new Pokemon({ name, type, level });

    await newPokemon.save();
    res.status(201).json({ message: "Pokémon créé avec succès !", pokemon: newPokemon });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du Pokémon", error });
  }
};
 
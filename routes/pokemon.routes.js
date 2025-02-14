// routes/pokemon.routes.js

const express = require('express');
const PokemonModel = require('../models/pokemon.model'); // Importer le modèle Pokémon
const PkmnTypes = require('../models/pkmnType.model'); // Importer les types de Pokémon
const { isAuthenticated, isAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

// Route pour récupérer tous les Pokémon
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const pokemons = await PokemonModel.find();
    res.status(200).json(pokemons); // Retourner la liste des Pokémon
  } catch (err) {
    res.status(400).json({ message: 'Erreur lors de la récupération des Pokémon', error: err });
  }
});

// Route pour créer un Pokémon (réservé aux admins)
router.post('/', isAuthenticated, isAdmin, async (req, res) => {
  const { name, imgUrl, description, types, regions } = req.body;

  // Validation des champs nécessaires
  if (!name || !imgUrl || !description || !types || !regions) {
    return res.status(400).json({ message: 'Tous les champs sont nécessaires' });
  }

  // Validation des types (ils doivent faire partie de la liste définie dans PkmnTypes)
  const invalidTypes = types.filter(type => !PkmnTypes.includes(type));
  if (invalidTypes.length > 0) {
    return res.status(400).json({ message: `Types invalides: ${invalidTypes.join(', ')}` });
  }

  try {
    const newPokemon = new PokemonModel({
      name,
      imgUrl,
      description,
      types,
      regions
    });

    await newPokemon.save(); // Enregistrer le nouveau Pokémon dans la base de données
    res.status(201).json({ message: 'Pokémon créé avec succès', pokemon: newPokemon });
  } catch (err) {
    res.status(400).json({ message: 'Erreur lors de la création du Pokémon', error: err });
  }
});

module.exports = router;

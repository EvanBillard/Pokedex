const express = require('express');
const PokemonModel = require('../models/pokemon.model'); 
const PkmnTypes = require('../models/pkmnType.model'); 
const { isAuthenticated, isAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

// Route pour récupérer tous les Pokémon
router.get('/', async (req, res) => {
  try {
    const pokemons = await PokemonModel.find();
    res.status(200).json(pokemons); 
  } catch (err) {
    res.status(400).json({ message: 'Erreur lors de la récupération des Pokémon', error: err });
  }
});

// Route pour créer un Pokémon
router.post('/', isAuthenticated, isAdmin, async (req, res) => {
  const { name, imgUrl, description, types, regions, soundPath } = req.body;


  if (!name || !imgUrl || !description || !types || !regions) {
    return res.status(400).json({ message: 'Tous les champs sont nécessaires' });
  }

  // Validation des types
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
      regions,
      soundPath 
    });

    await newPokemon.save(); 
    res.status(201).json({ message: 'Pokémon créé avec succès', pokemon: newPokemon });
  } catch (err) {
    res.status(400).json({ message: 'Erreur lors de la création du Pokémon', error: err });
  }
});

module.exports = router;

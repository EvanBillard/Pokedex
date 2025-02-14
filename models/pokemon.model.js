// models/pokemon.model.js

const mongoose = require('mongoose');
const PkmnType = require('./pkmnType.model'); // Importer la liste des types de Pokémon

const pokemonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imgUrl: { type: String, required: true },
  description: { type: String, required: true },
  types: [{ type: String, enum: PkmnType, required: true }], // Types validés par PkmnType
  regions: [{
    regionName: { type: String, required: true },
    regionPokedexNumber: { type: Number, required: true }
  }]
});

const PokemonModel = mongoose.model('Pokemon', pokemonSchema);

module.exports = PokemonModel;

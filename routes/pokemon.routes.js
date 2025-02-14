const express = require('express');
const { isAuthenticated, isAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', isAuthenticated, (req, res) => {
  res.send('Liste des Pokémon');
});

router.post('/', isAuthenticated, isAdmin, (req, res) => {
  res.send('Création d\'un Pokémon (réservé aux admins)');
});

module.exports = router;

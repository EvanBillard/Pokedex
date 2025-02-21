const express = require('express');
const TrainerModel = require('../models/trainer.model');
const { isAuthenticated } = require('../middlewares/auth.middleware');
const { getUserById } = require('../services/user.service');
const axios = require("axios");
const router = express.Router();

// POST /trainer - Créer un dresseur
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { trainerName, imgUrl, pkmnSeen, pkmnCatch } = req.body;

    if (!trainerName || !Array.isArray(pkmnSeen) || !Array.isArray(pkmnCatch)) {
      return res.status(400).json({ message: 'Les données sont manquantes ou incorrectes.' });
    }

    const userId = req.user.userId; // Assurez-vous que `req.user.userId` est défini dans le middleware
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    const email = user.email; // Récupérer l'email de l'utilisateur
    const newTrainer = new TrainerModel({
      email,
      trainerName,
      imgUrl,
      pkmnSeen,
      pkmnCatch
    });

    await newTrainer.save();
    res.status(201).json({ message: 'Dresseur créé avec succès', trainer: newTrainer });
  } catch (err) {
    console.error('Erreur lors de la création du trainer :', err);
    res.status(500).json({ message: 'Erreur interne lors de la création du dresseur', error: err.message });
  }
});

// PUT /trainer - Mettre à jour le dresseur
router.put('/', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    const email = user.email;
    const trainer = await TrainerModel.findOne({ email });
    if (!trainer) {
      return res.status(404).json({ message: 'Dresseur non trouvé pour cet utilisateur.' });
    }

    trainer.trainerName = req.body.trainerName || trainer.trainerName;
    trainer.imgUrl = req.body.imgUrl || trainer.imgUrl;
    trainer.pkmnSeen = req.body.pkmnSeen || trainer.pkmnSeen;
    trainer.pkmnCatch = req.body.pkmnCatch || trainer.pkmnCatch;

    await trainer.save();
    res.status(200).json({ message: 'Dresseur mis à jour avec succès', trainer });
  } catch (err) {
    console.error('Erreur lors de la mise à jour du dresseur :', err);
    res.status(500).json({ message: 'Erreur interne lors de la mise à jour du dresseur', error: err.message });
  }
});

// DELETE /trainer - Supprimer le dresseur
router.delete('/', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    const email = user.email;
    const trainer = await TrainerModel.findOne({ email });
    if (!trainer) {
      return res.status(404).json({ message: 'Dresseur non trouvé pour cet utilisateur.' });
    }

    await trainer.deleteOne();
    res.status(200).json({ message: 'Dresseur supprimé avec succès' });
  } catch (err) {
    console.error('Erreur lors de la suppression du dresseur :', err);
    res.status(500).json({ message: 'Erreur interne lors de la suppression du dresseur', error: err.message });
  }
});

// PUT /trainer/mark - Marquer un Pokémon comme vu ou capturé
router.put('/mark', isAuthenticated, async (req, res) => {
  try {
    const { pokemonName, isCaptured } = req.body; // Pokémon à ajouter et le statut isCaptured
    if (!pokemonName || typeof isCaptured !== 'boolean') {
      return res.status(400).json({ message: 'Paramètres invalides. Assurez-vous de fournir un nom de Pokémon et le statut isCaptured.' });
    }

    const userId = req.user.userId;
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    const email = user.email;
    const trainer = await TrainerModel.findOne({ email });
    if (!trainer) {
      return res.status(404).json({ message: 'Dresseur non trouvé pour cet utilisateur.' });
    }

    // Ajouter le Pokémon dans la liste appropriée (vu ou capturé)
    if (isCaptured) {
      if (!trainer.pkmnCatch.includes(pokemonName)) {
        trainer.pkmnCatch.push(pokemonName); // Ajouter à la liste des capturés
      }
    } else {
      if (!trainer.pkmnSeen.includes(pokemonName)) {
        trainer.pkmnSeen.push(pokemonName); // Ajouter à la liste des vus
      }
    }

    await trainer.save();
    res.status(200).json({ message: 'Pokémon ajouté avec succès', trainer });
  } catch (err) {
    console.error('Erreur lors de la mise à jour des Pokémon :', err);
    res.status(500).json({ message: 'Erreur interne lors de la mise à jour des Pokémon', error: err.message });
  }
});





// 🔹 Récupérer les Pokémon vus et capturés d'un dresseur
router.get("/me/pokedex", isAuthenticated, async (req, res) => {
  try {
    console.log("Utilisateur authentifié:", req.user);

    // Étape 1 : Récupérer le dresseur via l'ID de l'utilisateur authentifié
    const trainer = await TrainerModel.findOne({ userId: req.user.id });  // Utilisation de req.user.id pour récupérer le dresseur

    if (!trainer) {
      return res.status(404).json({ message: "Dresseur non trouvé" });
    }

    // Retourne les Pokémon vus et capturés
    res.json({
      pkmnSeen: trainer.pkmnSeen,
      pkmnCatch: trainer.pkmnCatch
    });

  } catch (err) {
    console.error("Erreur lors de la récupération du Pokédex:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});




module.exports = router;


const express = require('express');
const TrainerModel = require('../models/trainer.model');
const { isAuthenticated } = require('../middlewares/auth.middleware');
const { getUserById } = require('../services/user.service'); // Assurez-vous d'importer le service utilisateur
const router = express.Router();

// POST /trainer - Créer un dresseur
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { trainerName, imgUrl, pkmnSeen, pkmnCatch } = req.body;

    if (!trainerName || !Array.isArray(pkmnSeen) || !Array.isArray(pkmnCatch)) {
      return res.status(400).json({ message: 'Les données sont manquantes ou incorrectes.' });
    }

    // Récupérer l'ID de l'utilisateur depuis le token JWT
    const userId = req.user.userId; // Assurez-vous que `req.user.userId` est défini dans le middleware

    // Récupérer l'utilisateur avec son ID pour obtenir son email
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    const email = user.email; // Récupérer l'email de l'utilisateur

    // Créer un nouveau dresseur avec les informations reçues
    const newTrainer = new TrainerModel({
      email,
      trainerName,
      imgUrl,
      pkmnSeen,
      pkmnCatch
    });

    // Sauvegarder le dresseur dans la base de données
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
    // Récupérer l'ID de l'utilisateur depuis le token JWT
    const userId = req.user.userId;
    // Récupérer l'utilisateur pour obtenir son email
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    const email = user.email; // Récupérer l'email de l'utilisateur

    // Chercher le dresseur existant dans la base de données avec l'email de l'utilisateur
    const trainer = await TrainerModel.findOne({ email });
    if (!trainer) {
      return res.status(404).json({ message: 'Dresseur non trouvé pour cet utilisateur.' });
    }

    // Mettre à jour les informations du dresseur
    trainer.trainerName = req.body.trainerName || trainer.trainerName;
    trainer.imgUrl = req.body.imgUrl || trainer.imgUrl;
    trainer.pkmnSeen = req.body.pkmnSeen || trainer.pkmnSeen;
    trainer.pkmnCatch = req.body.pkmnCatch || trainer.pkmnCatch;

    // Sauvegarder les modifications dans la base de données
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
    // Récupérer l'ID de l'utilisateur depuis le token JWT
    const userId = req.user.userId;
    // Récupérer l'utilisateur pour obtenir son email
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    const email = user.email; // Récupérer l'email de l'utilisateur

    // Chercher le dresseur à supprimer avec l'email de l'utilisateur
    const trainer = await TrainerModel.findOne({ email });
    if (!trainer) {
      return res.status(404).json({ message: 'Dresseur non trouvé pour cet utilisateur.' });
    }

    // Supprimer le dresseur
    await trainer.deleteOne();
    res.status(200).json({ message: 'Dresseur supprimé avec succès' });
  } catch (err) {
    console.error('Erreur lors de la suppression du dresseur :', err);
    res.status(500).json({ message: 'Erreur interne lors de la suppression du dresseur', error: err.message });
  }
});

module.exports = router;

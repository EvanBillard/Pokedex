const TrainerModel = require('../models/trainer.model');

// Créer un nouveau dresseur
const createTrainer = async (email, trainerName, imgUrl, pkmnSeen, pkmnCatch) => {
  try {
    const newTrainer = new TrainerModel({
      email,
      trainerName,
      imgUrl,
      pkmnSeen,
      pkmnCatch
    });

    await newTrainer.save();
    return newTrainer;
  } catch (err) {
    throw new Error('Erreur lors de la création du dresseur : ' + err.message);
  }
};

// Mettre à jour un dresseur
const updateTrainer = async (email, updateData) => {
  try {
    const trainer = await TrainerModel.findOne({ email });
    if (!trainer) {
      throw new Error('Dresseur non trouvé.');
    }

    trainer.trainerName = updateData.trainerName || trainer.trainerName;
    trainer.imgUrl = updateData.imgUrl || trainer.imgUrl;
    trainer.pkmnSeen = updateData.pkmnSeen || trainer.pkmnSeen;
    trainer.pkmnCatch = updateData.pkmnCatch || trainer.pkmnCatch;

    await trainer.save();
    return trainer;
  } catch (err) {
    throw new Error('Erreur lors de la mise à jour du dresseur : ' + err.message);
  }
};

// Supprimer un dresseur
const deleteTrainer = async (email) => {
  try {
    const trainer = await TrainerModel.findOne({ email });
    if (!trainer) {
      throw new Error('Dresseur non trouvé.');
    }

    await trainer.deleteOne();
    return { message: 'Dresseur supprimé avec succès.' };
  } catch (err) {
    throw new Error('Erreur lors de la suppression du dresseur : ' + err.message);
  }
};

module.exports = {
  createTrainer,
  updateTrainer,
  deleteTrainer
};

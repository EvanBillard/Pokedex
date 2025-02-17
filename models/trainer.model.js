const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    trainerName: { type: String, required: true },
    imgUrl: { type: String },
    pkmnSeen: { type: [String], default: [] },
    pkmnCatch: { type: [String], default: [] },
    creationDate: { type: Date, default: Date.now }
  });

const TrainerModel = mongoose.model('Trainer', trainerSchema);
module.exports = TrainerModel;
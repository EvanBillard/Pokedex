const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },  // Gestion des rôles
  permissions: { 
    type: [String], 
    enum: ['CAN_CREATE_PKMN', 'CAN_EDIT_PKMN', 'CAN_DELETE_PKMN'], 
    default: [] 
  },  // Permissions associées à l'utilisateur
});

// Hash du mot de passe avant l'enregistrement
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Méthode pour vérifier si un utilisateur a une permission spécifique
userSchema.methods.hasPermission = function(permission) {
  return this.permissions.includes(permission);
};

const UserModel = mongoose.model('Users', userSchema);
module.exports = UserModel;

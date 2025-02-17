const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// 🔹 Fonction de validation de l'email
let validateEmail = function(email) {
  let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const userSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: true 
  },
  lastName: { 
    type: String, 
    required: true, 
    minlength: 2,   // Validation de la longueur du nom (min 2 caractères)
    maxlength: 40   // Validation de la longueur du nom (max 40 caractères)
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    validate: [validateEmail, 'Veuillez entrer une adresse email valide']  // Validation de l'email avec regex
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  permissions: { 
    type: [String], 
    enum: ['CAN_CREATE_PKMN', 'CAN_EDIT_PKMN', 'CAN_DELETE_PKMN'], 
    default: [] 
  }
});

// 🔹 Hook avant l'enregistrement d'un utilisateur
userSchema.pre('save', async function (next) {
  console.log('🛠️ Fonction exec avant le save');
  console.log(this);

  // Formatage du prénom et du nom
  if (this.firstName) {
    this.firstName = this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1).toLowerCase();
  }
  if (this.lastName) {
    this.lastName = this.lastName.toUpperCase();
  }

  // Hash du mot de passe uniquement s'il a été modifié
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

// 🔹 Hook avant la mise à jour d'un utilisateur
userSchema.pre('findOneAndUpdate', async function (next) {
  console.log('🛠️ Fonction exec avant la mise à jour');

  const update = this.getUpdate();

  // Formatage du prénom et du nom si mis à jour
  if (update.firstName) {
    update.firstName = update.firstName.charAt(0).toUpperCase() + update.firstName.slice(1).toLowerCase();
  }
  if (update.lastName) {
    update.lastName = update.lastName.toUpperCase();
  }

  // Hashage du mot de passe si modifié
  if (update.password) {
    update.password = await bcrypt.hash(update.password, 10);
  }

  this.setUpdate(update);
  next();
});

// 🔹 Vérification des permissions
userSchema.methods.hasPermission = function(permission) {
  return this.permissions.includes(permission);
};

const UserModel = mongoose.model('Users', userSchema);
module.exports = UserModel;

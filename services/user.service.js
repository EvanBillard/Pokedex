const UserModel = require("../models/user.model");

// Récupérer un utilisateur par son ID
const getUserById = async (id) => {
  return await UserModel.findById(id);
};

// Récupérer un utilisateur par son email
const getUserByEmail = async (email) => {
  return await UserModel.findOne({ email });
};

// Mettre à jour un utilisateur par son ID
const updateUserById = async (id, updateData) => {
  return await UserModel.findByIdAndUpdate(id, updateData, { new: true });
};

// Supprimer un utilisateur par son ID
const deleteUserById = async (id) => {
  return await UserModel.findByIdAndDelete(id);
};

module.exports = {
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};

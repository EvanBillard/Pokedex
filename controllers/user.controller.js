const UserService = require("../services/user.service");

// Récupérer un utilisateur par ID ou email
const getUser = async (req, res) => {
  const { id_or_email } = req.params;

  try {
    let user;
    if (id_or_email.includes("@")) {
      user = await UserService.getUserByEmail(id_or_email);
    } else {
      user = await UserService.getUserById(id_or_email);
    }

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Erreur interne", error: err.message });
  }
};

// Mettre à jour un utilisateur
const updateUser = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedUser = await UserService.updateUserById(id, updateData);
    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({ message: "Utilisateur mis à jour", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Erreur interne", error: err.message });
  }
};

// Supprimer un utilisateur
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await UserService.deleteUserById(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur interne", error: err.message });
  }
};

module.exports = {
  getUser,
  updateUser,
  deleteUser,
};

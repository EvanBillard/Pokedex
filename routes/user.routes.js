const express = require("express");
const { isAuthenticated, isAdmin } = require("../middlewares/auth.middleware");
const { getUser, updateUser, deleteUser } = require("../controllers/user.controller");

const router = express.Router();

//Récupérer un utilisateur par ID ou email
router.get("/:id_or_email", isAuthenticated, getUser);

//Mettre à jour un utilisateur
router.put("/:id", isAuthenticated, updateUser);

//Supprimer un utilisateur
router.delete("/:id", isAuthenticated, isAdmin, deleteUser);

module.exports = router;

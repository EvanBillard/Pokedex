const express = require("express");
const { isAuthenticated, isAdmin } = require("../middlewares/auth.middleware");
const { getUser, updateUser, deleteUser } = require("../controllers/user.controller");

const router = express.Router();

// Récupérer un utilisateur par ID ou email (accessible aux utilisateurs authentifiés)
router.get("/:id_or_email", isAuthenticated, getUser);

// Mettre à jour un utilisateur (seulement l'utilisateur lui-même ou un admin)
router.put("/:id", isAuthenticated, updateUser);

// Supprimer un utilisateur (seulement l'utilisateur lui-même ou un admin)
router.delete("/:id", isAuthenticated, isAdmin, deleteUser);

module.exports = router;

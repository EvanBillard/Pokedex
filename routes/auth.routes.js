const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../models/user.model');
const { checkUser } = require('../controllers/auth.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');

const router = express.Router();

// 🔹 Inscription
router.post('/register', async (req, res) => {
  try {
    const user = new UserModel(req.body);
    await user.save();
    res.status(201).send({ message: 'Utilisateur créé avec succès' });
  } catch (err) {
    res.status(400).send(err);
  }
});

// 🔹 Connexion
router.post('/login', async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).send({ message: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.SECRET_KEY || 'SECRET_KEY',
      { expiresIn: '1h' }
    );

    res.send({ token });
  } catch (err) {
    res.status(500).send(err);
  }
});

// 🔹 Vérification du token
router.get('/checkUser', isAuthenticated, checkUser);

module.exports = router;

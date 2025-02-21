const jwt = require('jsonwebtoken');

exports.isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send({ message: 'Token manquant' });

  try {
    const decoded = jwt.verify(token, 'SECRET_KEY');
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      email: decoded.email 
    };
    next();
  } catch (err) {
    res.status(401).send({ message: 'Token invalide' });
  }
};

exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).send({ message: 'Accès refusé' });
  }
  next();
};

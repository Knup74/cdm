
// Middleware pour vérifier le token JWT
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your-secret-key';

// Middleware pour vérifier si l'utilisateur est administrateur
function authorizeAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès interdit : rôle administrateur requis' });
  }
  next();
}

module.exports = authenticateToken;

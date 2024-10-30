
// Middleware pour vérifier le token JWT
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your-secret-key';

// Middleware pour vérifier si l'utilisateur est administrateur
function administrationToken(req, res, next) {  
  console.log(req.user.role);
  if (req.user.role !== 'administrateur') {
    return res.status(403).json({ message: 'Accès interdit : rôle administrateur requis' });
  }
  next();
}

module.exports = administrationToken;

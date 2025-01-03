
// Middleware pour vérifier le token JWT
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your-secret-key';

function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Token manquant' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token invalide' });
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;

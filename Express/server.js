const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importer cors
const bcrypt = require('bcrypt'); // Importer bcrypt
const db = require('../database/database.js');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your-secret-key';

app.use(cors());
app.use(bodyParser.json());

// Login route
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT * FROM coproprietaires WHERE email = ?`, [email], (err, row) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Erreur de serveur' });
      }
  
      if (!row) {
        return res.status(401).json({ success: false, message: 'Email incorrect' });
      }
  
      bcrypt.compare(password, row.password_hash, (err, match) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Erreur de serveur' });
        }
  
        if (!match) {
          return res.status(401).json({ success: false, message: 'mot de passe incorrect' });
        }
  
        // Authentification réussie, générer un token avec les informations de rôle
        const token = jwt.sign({ email: row.email, role: row.role }, 'secret_key', { expiresIn: '1h' });
  
        // Authentification réussie
        return res.json({ token });

      });
    });
});

app.post('/api/coproprietaire', (req, res) => {
  const { email } = req.body;

  db.get('SELECT * FROM coproprietaires WHERE email = ?', [email], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de la récupération du copropriétaire' });
    }
    if (!row) {
      return res.status(404).json({ message: 'Copropriétaire non trouvé' });
    }
    return res.json(row);
  });
});

  app.get('/api/coproprietaires', (req, res) => {
    console.log('Tentative de récupération des copropriétaires'); // Log avant l'appel
    db.all(`SELECT * FROM coproprietaires`, [], (err, rows) => {
      if (err) {
        console.error('Erreur lors de la requête:', err); // Log d'erreur
        return res.status(500).json({ success: false, message: 'Erreur de serveur' });
      }
      console.log('Copropriétaires récupérés:', rows); // Log des résultats
      res.json(rows);
    });
  });

// Protected route example
app.get('/protected', (req, res) => {
  const token = req.headers['authorization'];

  if (!token) return res.status(403).json({ message: 'Token required' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    return res.json({ message: 'Access granted', user: decoded });
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

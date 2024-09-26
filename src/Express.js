const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // Importer le middleware CORS
const app = express();
const db = require('../database/database.js');
app.use(express.json());
app.use(cors()); // Activer CORS pour toutes les routes
console.log('Objet de base de données:', db); // Vérifiez si l'objet db est bien défini


app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM coproprietaires WHERE email = ?`, [email], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erreur de serveur' });
    }

    if (!row) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
    }

    bcrypt.compare(password, row.password_hash, (err, match) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Erreur de serveur' });
      }

      if (!match) {
        return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
      }

      // Authentification réussie, générer un token avec les informations de rôle
      const token = jwt.sign({ email: row.email, role: row.role }, 'secret_key', { expiresIn: '1h' });

      // Authentification réussie
      res.json({ success: true });
    });
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

app.listen(3000, () => {
  console.log('Serveur API démarré sur le port 3000');
});

const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('../database/database.js');
const authenticateToken = require('./middleware/auth'); 
const authorizeAdmin = require('./middleware/auth-admin.js');  

// Importer le routeur des copropriétaires
const coproprietairesRoutes = require('./coproprietaires-API.js');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your-secret-key';

app.use(cors());
app.use(bodyParser.json());


// Login route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM coproprietaires WHERE email = ?', [email], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: 'Erreur de serveur' });

    if (!row) return res.status(401).json({ success: false, message: 'Email incorrect' });

    bcrypt.compare(password, row.password_hash, (err, match) => {
      if (err) return res.status(500).json({ success: false, message: 'Erreur de serveur' });
      if (!match) return res.status(401).json({ success: false, message: 'mot de passe incorrect' });

      const token = jwt.sign({ email: row.email, role: row.role }, SECRET_KEY, { expiresIn: '1h' });
      res.json({ token });
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

// Utiliser le routeur pour les routes copropriétaires
app.use('/api/coproprietaires', coproprietairesRoutes);

// Endpoint pour récupérer les dépenses
app.get('/api/depenses', authenticateToken, (req, res) => {
  const email = req.user.email;
  db.all(
    `SELECT d.id, d.description, d.montant_total 
     FROM depenses d
     JOIN coproprietaires c ON d.copropriete_id = c.copropriete_id
     WHERE c.email = ?`,
    [email],
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'Erreur lors de la récupération des dépenses' });
      res.json(rows);
    }
  );
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

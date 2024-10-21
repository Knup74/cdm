const express = require('express');
const router = express.Router();
const db = require('../database/database.js');
const bcrypt = require('bcrypt');
const authenticateToken = require('./middleware/auth');  
const authorizeAdmin = require('./middleware/auth-admin.js');  

// Récupérer tous les copropriétaires
router.get('/', (req, res) => {
  console.log('Tentative de récupération des copropriétaires');
  db.all('SELECT * FROM coproprietaires', [], (err, rows) => {
    if (err) {
      console.error('Erreur lors de la requête:', err);
      return res.status(500).json({ success: false, message: 'Erreur de serveur' });
    }
    console.log('Copropriétaires récupérés:', rows);
    res.json(rows);
  });
});

// Ajouter un nouveau copropriétaire
router.post('/',authenticateToken, authorizeAdmin, async (req, res) => {
  const { nom, email, password, tantiemes } = req.body;
  try {
    const password_hash = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO coproprietaires (nom, email, password_hash, tantiemes) VALUES (?, ?, ?, ?)';
    const params = [nom, email, password_hash, tantiemes];
    db.run(sql, params, function (err) {
      if (err) {
        return res.status(500).json({ message: 'Erreur lors de l\'ajout du copropriétaire' });
      }
      res.status(201).json({ id: this.lastID });
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du mot de passe' });
  }
});

// Mettre à jour un copropriétaire
router.put('/:id',authenticateToken, authorizeAdmin, (req, res) => {
  const { nom, email, tantiemes } = req.body;
  const id = req.params.id;
  db.run(
    'UPDATE coproprietaires SET nom = ?, email = ?, tantiemes = ? WHERE id = ?',
    [nom, email, tantiemes, id],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Erreur lors de la mise à jour du copropriétaire' });
      }
      res.json({ message: 'Copropriétaire mis à jour avec succès' });
    }
  );
});

// Supprimer un copropriétaire
router.delete('/:id',authenticateToken, authorizeAdmin, (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM coproprietaires WHERE id = ?', id, function (err) {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de la suppression du copropriétaire' });
    }
    res.json({ message: 'Copropriétaire supprimé avec succès' });
  });
});

module.exports = router;

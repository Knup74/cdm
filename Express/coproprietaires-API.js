const express = require('express');
const router = express.Router();
const db = require('../database/database.js');
const bcrypt = require('bcrypt');
const authenticateToken = require('./middleware/auth');  
const administrationToken = require('./middleware/auth-admin.js');  

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
router.post('/',authenticateToken, administrationToken, async (req, res) => {
  const { nom, prenom, email, tantieme, role } = req.body;
  try {
    const sql = 'INSERT INTO coproprietaires (email, nom,prenom,password_hash, tantieme, role) VALUES ( ?, ?, ?, ?, ?, ?)';
    const params = [email, nom, prenom,'', tantieme, role];
    console.log(nom);
    console.log(prenom);
    console.log(email);
    console.log(tantieme);
    console.log(role);
    console.log(sql);
    db.run(sql, params, function (err) {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: 'Erreur lors de l\'ajout du copropriétaire' });
      }
      res.status(201).json({ id: this.lastID });
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du mot de passe' });
  }
});

// Mettre à jour un copropriétaire
router.put('/:id',authenticateToken, administrationToken, (req, res) => {
  const { nom, prenom, email, tantieme, role } = req.body;
  const id = req.params.id;
  db.run(
    'UPDATE coproprietaires SET nom = ?, prenom = ?, email = ?, tantieme = ?, role = ? WHERE id = ?',
    [nom, prenom, email, tantieme, role, id],
    function (err) {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: 'Erreur lors de la mise à jour du copropriétaire' });
      }
      res.json({ message: 'Copropriétaire mis à jour avec succès' });
    }
  );
});

// Supprimer un copropriétaire
router.delete('/:id',authenticateToken, administrationToken, (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM coproprietaires WHERE id = ?', id, function (err) {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de la suppression du copropriétaire' });
    }
    res.json({ message: 'Copropriétaire supprimé avec succès' });
  });
});

module.exports = router;

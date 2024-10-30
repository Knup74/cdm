const express = require('express');
const router = express.Router();
const db = require('../database/database.js');
const authenticateToken = require('./middleware/auth');
const administrationToken = require('./middleware/auth-admin.js');

// Récupérer toutes les dépenses
router.get('/', authenticateToken, (req, res) => {
  console.log('Tentative de récupération des dépenses');
  db.all('SELECT * FROM depenses', [], (err, rows) => {
    if (err) {
      console.error('Erreur lors de la requête:', err);
      return res.status(500).json({ success: false, message: 'Erreur de serveur' });
    }
    console.log('Dépenses récupérées:', rows);
    res.json(rows);
  });
});

// Ajouter une nouvelle dépense
router.post('/', authenticateToken, administrationToken, (req, res) => {
  const { description, montant, date, copropriete_id } = req.body;
  const sql = 'INSERT INTO depenses (description, montant, date, copropriete_id) VALUES (?, ?, ?, ?)';
  const params = [description, montant, date, copropriete_id];

  db.run(sql, params, function (err) {
    if (err) {
      console.error('Erreur lors de l\'ajout de la dépense:', err);
      return res.status(500).json({ message: 'Erreur lors de l\'ajout de la dépense' });
    }
    res.status(201).json({ id: this.lastID });
  });
});

// Mettre à jour une dépense
router.put('/:id', authenticateToken, administrationToken, (req, res) => {
  const { description, montant, date, copropriete_id } = req.body;
  const id = req.params.id;

  const sql = 'UPDATE depenses SET description = ?, montant = ?, date = ?, copropriete_id = ? WHERE id = ?';
  const params = [description, montant, date, copropriete_id, id];

  db.run(sql, params, function (err) {
    if (err) {
      console.error('Erreur lors de la mise à jour de la dépense:', err);
      return res.status(500).json({ message: 'Erreur lors de la mise à jour de la dépense' });
    }
    res.json({ message: 'Dépense mise à jour avec succès' });
  });
});

// Supprimer une dépense
router.delete('/:id', authenticateToken, administrationToken, (req, res) => {
  const id = req.params.id;

  db.run('DELETE FROM depenses WHERE id = ?', id, function (err) {
    if (err) {
      console.error('Erreur lors de la suppression de la dépense:', err);
      return res.status(500).json({ message: 'Erreur lors de la suppression de la dépense' });
    }
    res.json({ message: 'Dépense supprimée avec succès' });
  });
});

module.exports = router;

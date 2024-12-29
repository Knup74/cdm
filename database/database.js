const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const db = new sqlite3.Database(`process.env.VUE_APP_BDD_BASE_PATH`, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Erreur lors de la connexion à la base de données:', err.message);
  } else {
    console.log('Connecté à la base de données SQLite.');
  }
});

db.serialize(async () => {
  // Créez la table des copropriétaires
  db.run(`CREATE TABLE IF NOT EXISTS coproprietaires (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    nom TEXT,
    prenom TEXT,
    password_hash TEXT,
    tantieme INTEGER,
    role TEXT DEFAULT 'utilisateur'
  )`, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table coproprietaires:', err.message);
    } else {
      console.log('Table coproprietaires créée.');
    }
  });

  // Créez la table des copropriétés
  db.run(`CREATE TABLE IF NOT EXISTS coproprietes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT UNIQUE
  )`, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table coproprietes:', err.message);
    } else {
      console.log('Table coproprietes créée.');
    }
  });

  // Créez la table de liaison
  db.run(`CREATE TABLE IF NOT EXISTS coproprietaires_coproprietes (
    coproprietaire_id INTEGER,
    copropriete_id INTEGER,
    FOREIGN KEY (coproprietaire_id) REFERENCES coproprietaires(id),
    FOREIGN KEY (copropriete_id) REFERENCES coproprietes(id),
    PRIMARY KEY (coproprietaire_id, copropriete_id)
  )`, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table coproprietaires_coproprietes:', err.message);
    } else {
      console.log('Table coproprietaires_coproprietes créée.');
    }
  });

  // Créez la table des dépenses
  db.run(`CREATE TABLE IF NOT EXISTS depenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    copropriete_id INTEGER,
    montant REAL,
    description TEXT,
    date DATE,
    FOREIGN KEY (copropriete_id) REFERENCES coproprietes(id)
  )`, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table depenses:', err.message);
    } else {
      console.log('Table depenses créée.');
    }
  });

  // Hachage du mot de passe par défaut
  const defaultPassword = 'password123';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  // Insertion d'un utilisateur par défaut
  db.run(`INSERT INTO coproprietaires (email, nom,prenom,password_hash, tantieme, role) VALUES (?, ?, ?, ?, ?, ?)`,
    ['plf74@msn.com', 'Ferrer','Pierre-Louis', hashedPassword, 100, 'administrateur'], (err) => {
      if (err) {
        console.error('Erreur lors de l\'insertion de l\'utilisateur par défaut:', err.message);
      } else {
        console.log('Utilisateur par défaut inséré.');
      }

      // Insertion d'une copropriété par défaut après l'insertion de l'utilisateur
      db.run(`INSERT INTO coproprietes (nom) VALUES (?)`, ['Copropriété A'], (err) => {
        if (err) {
          console.error('Erreur lors de l\'insertion de la copropriété par défaut:', err.message);
        } else {
          console.log('Copropriété par défaut insérée.');
        }

        // Insertion d'une dépense par défaut après l'insertion de la copropriété
        db.run(`INSERT INTO depenses (copropriete_id, montant, description, date) VALUES (?, ?, ?, ?)`,
          [1, 500.00, 'Dépense de maintenance', '2024-01-01'], (err) => {
            if (err) {
              console.error('Erreur lors de l\'insertion de la dépense par défaut:', err.message);
            } else {
              console.log('Dépense par défaut insérée.');
            }
          });
      });
    });
});

module.exports = db; // Cela doit être à la fin de votre fichier database.js

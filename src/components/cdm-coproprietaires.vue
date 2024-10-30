<template>
  <div class="coproprietaires">
    <h2>Liste des Copropriétaires</h2>

    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nom</th>
          <th>Prénom</th>
          <th>Email</th>
          <th>Tantièmes</th>
          <th>Rôle</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="coproprietaire in coproprietaires" :key="coproprietaire.id">
          <td>{{ coproprietaire.id }}</td>
          <td>{{ coproprietaire.nom }}</td>
          <td>{{ coproprietaire.prenom }}</td>
          <td>{{ coproprietaire.email }}</td>
          <td>{{ coproprietaire.tantieme }}</td>
          <td>{{ coproprietaire.role }}</td>
          <td>
            <button class="btn btn-primary" @click="editCoproprietaire(coproprietaire)">Éditer</button>
            <button class="btn btn-danger" @click="deleteCoproprietaire(coproprietaire.id)">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Formulaire pour ajouter/éditer un copropriétaire -->
    <h3>{{ isEdit ? 'Éditer' : 'Ajouter' }} un copropriétaire</h3>
    <form @submit.prevent="isEdit ? updateCoproprietaire() : addCoproprietaire()">
      <div class="form-group">
        <label for="nom">Nom :</label>
        <input type="text" id="nom" v-model="newCoproprietaire.nom" required />
      </div>
      <div class="form-group">
        <label for="prenom">Prénom :</label>
        <input type="text" id="prenom" v-model="newCoproprietaire.prenom" required />
      </div>
      <div class="form-group">
        <label for="email">Email :</label>
        <input type="email" id="email" v-model="newCoproprietaire.email" required />
      </div>
      <div class="form-group">
        <label for="tantieme">Tantièmes :</label>
        <input type="number" id="tantieme" v-model="newCoproprietaire.tantieme" required />
      </div>
      <div class="form-group">
        <label for="role">Rôle :</label>
        <select id="role" v-model="newCoproprietaire.role" required>
          <option value="utilisateur">Utilisateur</option>
          <option value="administrateur">Administrateur</option>
        </select>
      </div>
      <button type="submit" class="btn btn-success">{{ isEdit ? 'Mettre à jour' : 'Ajouter' }}</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      coproprietaires: [],
      newCoproprietaire: {
        id: null,
        nom: '',
        prenom: '',
        email: '',
        tantieme: 0,
        role: 'utilisateur' // Rôle par défaut
      },
      isEdit: false // Détecte si on est en mode édition
    };
  },
  created() {
    this.getCoproprietaires();
  },
  methods: {
    async getCoproprietaires() {
      try {
        const response = await axios.get('http://localhost:3000/api/coproprietaires');
        this.coproprietaires = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des copropriétaires', error);
      }
    },
    async addCoproprietaire() {
      try {
        const token = localStorage.getItem('jwt');
        const response = await axios.post('http://localhost:3000/api/coproprietaires', this.newCoproprietaire, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.coproprietaires.push(response.data);
        this.resetForm();
      } catch (error) {
        console.error("Erreur lors de l'ajout du copropriétaire", error);
      }
    },
    async deleteCoproprietaire(id) {
      try {
        const token = localStorage.getItem('jwt');
        await axios.delete(`http://localhost:3000/api/coproprietaires/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.coproprietaires = this.coproprietaires.filter(c => c.id !== id);
      } catch (error) {
        console.error("Erreur lors de la suppression du copropriétaire", error);
      }
    },
    editCoproprietaire(coproprietaire) {
      this.newCoproprietaire = { ...coproprietaire }; // Cloner les données pour éviter les mutations
      this.isEdit = true;
    },
    async updateCoproprietaire() {
      try {
        const token = localStorage.getItem('jwt');
        const response = await axios.put(
          `http://localhost:3000/api/coproprietaires/${this.newCoproprietaire.id}`,
          this.newCoproprietaire,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        const index = this.coproprietaires.findIndex(c => c.id === this.newCoproprietaire.id);
        this.$set(this.coproprietaires, index, response.data);
        this.resetForm();
      } catch (error) {
        console.error("Erreur lors de la mise à jour du copropriétaire", error);
      }
    },
    resetForm() {
      this.newCoproprietaire = { id: null, nom: '', prenom: '', email: '', tantieme: 0, role: 'utilisateur' };
      this.isEdit = false;
    }
  }
};
</script>

<style scoped>
@import "@/assets/coproprietaires.scss";
</style>

<template>
    <div class="depenses">
      <h2>Gestion des Dépenses</h2>
  
      <!-- Formulaire d'ajout de dépenses -->
      <form @submit.prevent="addDepense">
        <div>
          <label for="description">Description :</label>
          <input type="text" v-model="newDepense.description" id="description" required />
        </div>
        <div>
          <label for="montant">Montant :</label>
          <input type="number" v-model="newDepense.montant" id="montant" required />
        </div>
        <button type="submit">Ajouter Dépense</button>
      </form>
  
      <!-- Liste des dépenses -->
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Montant</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="depense in depenses" :key="depense.id">
            <td>
              <input
                type="text"
                v-model="depense.description"
                :disabled="!depense.editing"
              />
            </td>
            <td>
              <input
                type="number"
                v-model="depense.montant"
                :disabled="!depense.editing"
              />
            </td>
            <td>
              <button @click="deleteDepense(depense.id)">Supprimer</button>
              <button @click="toggleEdit(depense)">
                {{ depense.editing ? 'Enregistrer' : 'Modifier' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        depenses: [],
        newDepense: {
          description: '',
          montant: 0,
        },
      };
    },
    created() {
      this.fetchDepenses();
    },
    methods: {
      async fetchDepenses() {
        try {
        const token = localStorage.getItem('jwt');
        const response = await axios.get('http://localhost:3000/api/depenses', {
          headers: { Authorization: `Bearer ${token}` }
        });
          this.depenses = response.data.map(depense => ({
            ...depense,
            editing: false,
          }));
        } catch (error) {
          console.error('Erreur lors de la récupération des dépenses :', error);
        }
      },
      async addDepense() {
        try {
          const token = localStorage.getItem('jwt');
          const response = await axios.post('http://localhost:3000/api/depenses', this.newDepense, {
            headers: { Authorization: `Bearer ${token}` }
          });
          this.depenses.push({ ...response.data, editing: false });
          this.newDepense.description = '';
          this.newDepense.montant = 0;
        } catch (error) {
          console.error("Erreur lors de l'ajout de la dépense :", error);
        }
      },
      toggleEdit(depense) {
        if (depense.editing) {
          this.updateDepense(depense);
        }
        depense.editing = !depense.editing;
      },
      async updateDepense(depense) {
        try {            
          const token = localStorage.getItem('jwt');
          await axios.put(`http://localhost:3000/api/depenses/${depense.id}`, {
            description: depense.description,
            montant: depense.montant,
          }, {
            headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
          console.error("Erreur lors de la mise à jour de la dépense :", error);
        }
      },
      async deleteDepense(id) {
        try {
            const token = localStorage.getItem('jwt');
          await axios.delete(`http://localhost:3000/api/depenses/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
            });
          this.depenses = this.depenses.filter(depense => depense.id !== id);
        } catch (error) {
          console.error("Erreur lors de la suppression de la dépense :", error);
        }
      },
    },
  };
  </script>
  
  
<style scoped>
@import "@/assets/depenses.scss";
</style>
  
<template>
  <div class="home">
    <h2>Bienvenue sur la page de gestion de copropriété</h2>

    <ul>
      <li v-if="coproprietaire">
        {{ coproprietaire.email }} - Tantièmes : {{ coproprietaire.tantieme }}
      </li>
    </ul>

    <!-- Tableau récapitulatif des dépenses -->
    <h3>Récapitulatif des dépenses de copropriété</h3>
    <table v-if="depenses.length > 0">
      <thead>
        <tr>
          <th>Description</th>
          <th>Montant total</th>
          <th>Part attribuée</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="depense in depenses" :key="depense.id">
          <td>{{ depense.description }}</td>
          <td>{{ depense.montant }} €</td>
          <td>{{ calculerPart(depense.montant) }} €</td>
        </tr>
      </tbody>
    </table>
    <p v-else>Aucune dépense trouvée.</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      coproprietaire: null,
      depenses: [] // Liste des dépenses de la copropriété
    };
  },
  created() {
    this.getCoproprietaire();
    this.getDepenses(); // Appel pour récupérer les dépenses
  },
  methods: {
    async getCoproprietaire() {
      try {
        const token = localStorage.getItem('jwt');
        if (!token) {
          console.error('Aucun token trouvé');
          return;
        }

        const payload = JSON.parse(atob(token.split('.')[1]));
        const email = payload.email;

        const response = await axios.post(
          'http://localhost:3000/api/coproprietaire', 
          { email },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        this.coproprietaire = response.data;
        console.log('Copropriétaire:', this.coproprietaire);
      } catch (error) {
        console.error('Erreur lors de la récupération du copropriétaire', error);
      }
    },
    async getDepenses() {
      try {
        const token = localStorage.getItem('jwt');
        const response = await axios.get('http://localhost:3000/api/depenses', {
          headers: { Authorization: `Bearer ${token}` }
        });

        this.depenses = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des dépenses', error);
      }
    },
    calculerPart(montantTotal) {
      if (this.coproprietaire && this.coproprietaire.tantieme) {
        // Calculer la part du copropriétaire en fonction des tantièmes
        return (montantTotal * this.coproprietaire.tantieme) / 1000; // Adapter selon le calcul
      }
      return 0;
    }
  }
};
</script>
1

<style scoped>
  @import "@/assets/home.scss";
</style>

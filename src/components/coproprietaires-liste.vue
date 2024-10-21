<!-- src/components/CoproprietairesListe.vue -->
<template>
  <div>
    <h2>Liste des copropriétaires</h2>
    <ul>
      <li v-for="coproprietaire in coproprietaires" :key="coproprietaire.id">
        {{ coproprietaire.nom }} - Tantièmes : {{ coproprietaire.tantiemes }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      coproprietaires: []
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
    }
  }
};
</script>


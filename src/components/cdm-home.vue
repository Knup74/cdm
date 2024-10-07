<template>
  <div class="home">
    <h2>Bienvenue sur la page de gestion de copropriété</h2>
    <ul>
      <li v-if="coproprietaire">
        {{ coproprietaire.email }} - Tantièmes : {{ coproprietaire.tantieme }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      coproprietaire: null, // Un seul copropriétaire, celui qui est connecté
    };
  },
  created() {
    this.getCoproprietaire();
  },
  methods: {
    async getCoproprietaire() {
      try {
        // Récupérer le token JWT depuis localStorage
        const token = localStorage.getItem('jwt');
        if (!token) {
          console.error('Aucun token trouvé');
          return;
        }

        // Extraire l'email ou l'ID de l'utilisateur depuis le token
        const payload = JSON.parse(atob(token.split('.')[1]));
        const email = payload.email;

        // Requête POST pour récupérer le copropriétaire correspondant
        const response = await axios.post(
          'http://localhost:3000/api/coproprietaire', 
          { email }, // Envoyer l'email dans le body de la requête POST
          { headers: { Authorization: `Bearer ${token}` } } // Inclure le token dans le header
        );

        // Stocker les informations du copropriétaire
        this.coproprietaire = response.data;
        console.log('Copropriétaire:', this.coproprietaire);
      } catch (error) {
        console.error('Erreur lors de la récupération du copropriétaire', error);
      }
    }
  }
};
</script>

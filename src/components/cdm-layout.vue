<template>
  <div class="authenticated-layout">
    <header>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <router-link class="navbar-brand" to="/home">Copro des moulins</router-link>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <router-link class="nav-link" to="/home">Home</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/profile">Profile</router-link>
              </li>
              
              <!-- Menu Administration pour les administrateurs -->
              <li v-if="isAdmin" class="nav-item dropdown">
                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Administration
                </a>
                <ul class="dropdown-menu">
                  <li><router-link class="dropdown-item" to="/admin/coproprietaires">Copropriétaires</router-link></li>
                  <li><router-link class="dropdown-item" to="/admin/depenses">Dépenses</router-link></li>
                  <!-- <li><router-link class="dropdown-item" to="/admin/another-table">Autre Table</router-link></li> -->
                  <!-- Ajoute d'autres liens ici -->
                </ul>
              </li>
            </ul>
            <button class="btn btn-danger ms-auto" @click="logout">Déconnexion</button>
          </div>
        </div>
      </nav>
    </header>
    
    <!-- Contenu spécifique à la route -->
    <main>
      <router-view /> <!-- Ceci affichera le contenu de la route spécifique -->
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isAdmin: false // Contrôle l'affichage du menu "Administration"
    };
  },
  created() {
    this.checkUserRole();
  },
  methods: {
    checkUserRole() {
      const token = localStorage.getItem('jwt');
      if (token) {
        try {
          const decoded = JSON.parse(window.atob(token.split(".")[1]));
          this.isAdmin = decoded.role === 'administrateur'; // Vérifie si le rôle est "administrateur"
        } catch (e) {
          console.error('Erreur de décodage du token JWT:', e);
        }
      }
    },
    logout() {
      // Action de déconnexion
      localStorage.removeItem('jwt'); // Supprimer le token JWT
      this.$router.push('/login'); // Rediriger vers la page de login
    }
  }
};
</script>

<style scoped>
  @import "@/assets/layout.scss";
</style>

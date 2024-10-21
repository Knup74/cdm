<template>
    <div class="authenticated-layout">
      <header>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <div class="container-fluid">
            <router-link class="navbar-brand" to="/home">Copro des moulins</router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
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
                <!-- Ajouter d'autres liens si nécessaire -->
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
    methods: {
      logout() {
        // Action de déconnexion
        localStorage.removeItem('jwt'); // Supprimer le token JWT
        this.$router.push('/login'); // Rediriger vers la page de login
      }
    }
  };
  </script>
  
<script setup>
import Header from './components/Header.vue'
</script>

<template>
  <Header />
  <router-view />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
nav {
  margin: 1rem;
}
</style>
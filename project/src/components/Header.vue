<template>
  <header class="bg-light py-3 mb-4 shadow-sm">
    <div class="container d-flex flex-column flex-md-row align-items-center justify-content-between">

      <!-- Logo + title -->
      <div class="d-flex align-items-center">
        <img src="../assets/images/logo.jpg" alt="Hope Haven logo" style="height:52px" />
        <h1 class="ms-3 h5 mb-0">Hope Haven Pet Rescue</h1>
      </div>

      <!-- Navigation + role display -->
      <div class="d-flex flex-column flex-md-row align-items-center mt-2 mt-md-0">

        <!-- Navigation links -->
        <nav class="me-md-3 mb-2 mb-md-0" aria-label="Main navigation">
          <router-link class="me-3" to="/">Home</router-link>
          <router-link class="me-3" to="/about">About</router-link>
          <router-link class="me-3" to="/news">News</router-link>
          <router-link to="/login">Login</router-link>
          <router-link v-if="!user" to="/login">Login</router-link>
        </nav>

        <!-- Current user / role -->
        <div v-if="user" class="text-end d-flex align-items-center gap-2">
          <span>Logged in as: <strong>{{ user.username }}</strong></span>
          <span> | Role: </span>
          <select v-model="userRole" @change="changeRole" class="form-select form-select-sm">
            <option value="viewer">Viewer</option>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>

      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAuth } from '../composables/useAuth'

const { user } = useAuth()

// local ref for the role dropdown
const userRole = ref(user.value?.role || 'viewer')

// Watch the user object to update the dropdown if user changes
watch(user, (newUser) => {
  if (newUser) userRole.value = newUser.role
})

// function to change the role dynamically
function changeRole() {
  if (user.value) {
    user.value.role = userRole.value
    // persist to localStorage
    localStorage.setItem('user', JSON.stringify(user.value))
  }
}
</script>

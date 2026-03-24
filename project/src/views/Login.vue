<template>
  <div class="container py-4">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="username" placeholder="username" class="form-control mb-2" />
      <input v-model="password" placeholder="password" type="password" class="form-control mb-2" />

      <label for="role" class="form-label">Select Role</label>
      <select id="role" v-model="role" class="form-select mb-3">
        <option value="viewer">Viewer</option>
        <option value="member">Member</option>
        <option value="admin">Admin</option>
      </select>

      <button class="btn btn-primary">Login</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const username = ref('')
const password = ref('')
const role = ref('viewer') // default role
const router = useRouter()

const { login } = useAuth()

function handleLogin() {
  // Save user with selected role
  localStorage.setItem(
    'user',
    JSON.stringify({ username: username.value, password: password.value, role: role.value })
  )

  router.push('/news')
}
</script>
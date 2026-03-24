<template>
  <div class="container py-4 text-center">
    <h2>About Hope Haven</h2>
    <p>
      Hope Haven Pet Rescue Centre is a community-driven organisation  
      helping stray and abandoned pets find new families.
    </p>

    <div class="mt-3">
      <h2 v-if="fullName" class="mt-2"><strong>Welcome, {{ fullName }}! 💕</strong></h2>
      <input v-model="firstName" placeholder="First Name" class="form-control mb-2" />
      <input v-model="lastName" placeholder="Last Name" class="form-control" />
    </div>

    <div class="mt-5">
      <h3 class="mt-4">🐾 Random Animal Fact</h3>

      <button @click="loadRandomFact" class="btn btn-primary mt-3">
        Generate Fact
      </button>

      <div class="mt-3">
        <p v-if="loading">Loading fact...</p>

        <div v-if="fact" class="alert alert-info">
          {{ fact }}
        </div>

        <div v-if="image" class="mt-3">
          <img :src="image" class="img-fluid rounded shadow-sm" alt="Animal" />
        </div>
      </div>
    </div>

    <div class="mt-4">
      <label><input type="radio" value="centre" v-model="selectedImage" /> Our Centre 🏡</label>
      <label class="ms-3"><input type="radio" value="pets" v-model="selectedImage" /> The Playground 🥏</label>

      <div class="mt-3">
        <img v-if="selectedImage === 'centre'" src="../assets/images/shelter.jpg" class="img-fluid rounded shadow-sm" alt="Centre" />
        <img v-else-if="selectedImage === 'pets'" src="../assets/images/playground.jpg" class="img-fluid rounded shadow-sm" alt="Pets" />
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, computed } from "vue"

const firstName = ref("")
const lastName = ref("")
const selectedImage = ref("centre")
const fullName = computed(() => `${firstName.value} ${lastName.value}`.trim())

// --- Random Animal Fact API ---
const APIs = [
  { name: "cat", url: "https://catfact.ninja/fact" },
  { name: "dog", url: "https://dogapi.dog/api/facts" },
  { name: "fox", url: "https://randomfox.ca/floof/" }
]

const fact = ref("")
const image = ref("")
const loading = ref(false)

async function loadRandomFact() {
  loading.value = true
  fact.value = ""
  image.value = ""

  // Pick one API randomly
  const api = APIs[Math.floor(Math.random() * APIs.length)]

  try {
    if (api.name === "cat") {
      const res = await fetch(api.url)
      const data = await res.json()
      fact.value = data.fact

    } else if (api.name === "dog") {
      const res = await fetch(api.url)
      const data = await res.json()
      fact.value = data.facts[0]

    } else if (api.name === "fox") {
      const res = await fetch(api.url)
      const data = await res.json()

      image.value = data.image
      fact.value = "Here’s a random fox! 🦊"
    }

  } catch (error) {
    fact.value = "Oops! Could not load a fact right now."
  }

  loading.value = false
}
</script>
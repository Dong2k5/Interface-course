<template>
  <div class="home-page">
    <!-- Title -->
    <section class="text-center my-4">
      <h1 class="display-4 fw-bold">{{ centreName }}</h1>
      <p class="lead fst-italic">{{ slogan }}</p>
    </section>

    <!-- The welcome paragraph -->
    <section class="container my-4">
      <p>
        Welcome to {{ centreName }}! We are dedicated to rescuing and finding loving homes for abandoned and
        neglected animals. Explore our site to learn more about our mission, view pets available for adoption, and
        find out how you can get involved. Together, we can make a difference in the lives of these wonderful
        creatures.
      </p>
      <img src="../assets/images/shelter1.jpg" alt="Cats palce" class="img-fluid my-4 rounded shadow-sm" />
      <img src="../assets/images/shelter3.jpg" alt="Dogs place" class="img-fluid my-4 rounded shadow-sm" />

    </section>

    <!-- Add Pet Form + Filters -->
    <section class="container my-4">
      <div class="row">
        <div class="col-md-6" v-if="isAdmin()">
          <button class="btn btn-primary mb-3" @click="showForm = !showForm">
            {{ showForm ? "Close Form" : "Add New Pet" }}
          </button>

          <PetForm 
            v-if="showForm"
            mode="add" 
            @save="handleAdd" 
          />
        </div>

        <div class="col-md-6">
          <h4>Search & Filters</h4>
          <PetFilter :initial="{ q: '', type: '', status: '' }" @change="onFilterChange" />
        </div>
      </div>
    </section>

    <!-- Pet List -->
    <section class="mt-4">
      <h3>Pets</h3>
      <PetList :pets="filteredPets" @delete="handleDelete" :highlight-id="highlightId" />
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import PetForm from '../components/PetForm.vue'
import PetList from '../components/PetList.vue'
import PetFilter from '../components/PetFilter.vue'
import { usePets } from '../composables/usePets'
import { useAuth } from '../composables/useAuth'

// Auth composable
const { isAdmin } = useAuth()

// Form visibility
const showForm = ref(false)

// Centre info
const centreName = "Hope Haven Rescue Centre"
const slogan = "Every life deserves a loving home"

// Pets composable
const { pets, addPet, deletePet } = usePets()
const highlightId = ref(null)

// Filters
const searchQuery = ref('')
const filterType = ref('')
const filterStatus = ref('')

// Add pet handler
function handleAdd(payload) {
  if (!isAdmin()) return alert("Only admin can add pets.")

  const newPet = addPet(payload)
  highlightId.value = newPet.id
  showForm.value = false  // auto close form

  setTimeout(() => (highlightId.value = null), 1200)
}

// Delete pet handler
function handleDelete(id) {
  if (confirm('Are you sure you want to delete this pet?')) {
    deletePet(id)
  }
}

// Filter change from PetFilter component
function onFilterChange(filter) {
  searchQuery.value = filter.q
  filterType.value = filter.type
  filterStatus.value = filter.status
}

// Computed filtered pets
const filteredPets = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return pets.value.filter(pet => {
    const matchesSearch =
      pet.name.toLowerCase().includes(q) ||
      pet.type.toLowerCase().includes(q) ||
      pet.city.toLowerCase().includes(q)

    const matchesType = filterType.value ? pet.type === filterType.value : true
    const matchesStatus = filterStatus.value ? pet.status === filterStatus.value : true

    return matchesSearch && matchesType && matchesStatus
  })
})
</script>

<style scoped>
.home-page { background-color: #fffaf5; }
</style>
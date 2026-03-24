<template>
  <div class="col-md-4 mb-3">
    <div class="card p-3 h-100" v-highlight="highlightKey">
      <!-- Card header -->
      <div class="d-flex justify-content-between align-items-start">
        <h5 class="card-title mb-0">{{ pet.name }}</h5>
        <small class="text-muted">{{ pet.type }}</small>
      </div>

      <!-- Card body -->
      <p class="mb-1">
        {{ pet.status }} — {{ pet.city }}
        <span v-if="hasPendingRequest" class="badge pending-badge ms-2">Pending</span>
      </p>
      <p class="small mb-2" v-if="pet.description">{{ pet.description }}</p>
      <p class="small text-muted" v-if="pet.rescueDate">Rescued: {{ pet.rescueDate }}</p>

      <!-- Card actions -->
      <div class="mt-auto d-flex flex-column gap-2">
        <!-- Admin buttons -->
        <div v-if="admin" class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-warning" @click="goEdit">Edit</button>
          <button class="btn btn-sm btn-outline-danger" @click="confirmDelete">Delete</button>
        </div>

        <!-- View Details -->
        <router-link :to="`/pet/${pet.id}`" class="btn btn-outline-primary btn-sm mt-2">
          View Details
        </router-link>

        <!-- Like button for members -->
        <button
          v-if="!admin && member"
          class="btn btn-sm mt-1"
          :class="liked ? 'btn-success' : 'btn-outline-primary'"
          @click="toggleLike"
        >
          ❤️ Like {{ pet.likes || 0 }}
        </button>

        <!-- Pending adoption request actions for admin -->
        <div v-if="admin && hasPendingRequest" class="pending-actions mt-2">
          <p class="mb-1">Pending Adoption Request:</p>
          <button class="btn approve-btn mb-1" @click="approvePending">Approve</button>
          <button class="btn reject-btn" @click="rejectPending">Reject</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useAdoptions } from '../composables/useAdoptions.js'

const props = defineProps({
  pet: { type: Object, required: true },
})
const emit = defineEmits(['deleted', 'liked'])

const router = useRouter()
const { isAdmin, isMember } = useAuth()

// Computed properties
const admin = computed(isAdmin)
const member = computed(isMember)

// --- Like handling ---
const liked = ref(false)
function toggleLike() {
  const currentLikes = props.pet.likes || 0
  if (liked.value) {
    props.pet.likes = Math.max(currentLikes - 1, 0)
    liked.value = false
  } else {
    props.pet.likes = currentLikes + 1
    liked.value = true
  }
  emit('liked', props.pet)
}

// --- Admin methods ---
function goEdit() {
  router.push({ name: 'EditPet', params: { id: props.pet.id } })
}
function confirmDelete() {
  if (confirm(`Delete ${props.pet.name}? This cannot be undone.`)) {
    emit('deleted', props.pet.id)
  }
}
// --- Adoption request handling ---
const { adoptions, updateAdoption } = useAdoptions()
const hasPendingRequest = computed(() => 
  adoptions.value.some(a => a.petId === props.pet.id && a.status === 'Pending')
)

// --- Pending adoption handling ---
function approvePending() {
  const req = adoptions.value.find(r => r.petId === props.pet.id && r.status === 'Pending')
  if (req) {
    updateAdoption({ ...req, status: 'Approved' })
    alert(`Adoption request for ${props.pet.name} approved!`)
  }
}

function rejectPending() {
  const req = adoptions.value.find(r => r.petId === props.pet.id && r.status === 'Pending')
  if (req) {
    updateAdoption({ ...req, status: 'Rejected' })
    alert(`Adoption request for ${props.pet.name} rejected!`)
  }
}
</script>

<style scoped>
/* Pending badge */
.pending-badge {
  background-color: #ffc107; /* theme yellow */
  color: #212529;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 0.8rem;
}

/* Pending action buttons for admin */
.pending-actions p {
  margin-bottom: 6px;
  font-weight: 500;
  color: #333;
}

.approve-btn {
  background-color: #28a745; /* theme green */
  color: #fff;
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
}

.approve-btn:hover {
  background-color: #218838;
}

.reject-btn {
  background-color: #dc3545; /* theme red */
  color: #fff;
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
}

.reject-btn:hover {
  background-color: #c82333;
}
</style>
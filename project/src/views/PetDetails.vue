<template>
  <div class="pet-details">
    <div v-if="pet" class="details-container">

      <h2>{{ pet.name }}</h2>
        <p><strong>Type:</strong> {{ pet.type }}</p>
        <p><strong>Status:</strong> {{ pet.status }}</p>
        <p><strong>City:</strong> {{ pet.city }}</p>
        <p v-if="pet.rescueDate"><strong>Rescued:</strong> {{ pet.rescueDate }}</p>
        <p v-if="pet.description"><strong>Description:</strong> {{ pet.description }}</p>

      <!-- Authenticated Users -->
      <button v-if="isUser" @click="toggleLike" class="btn like-btn">
        {{ isLiked ? "❤️ Liked" : "🤍 Like" }}
      </button>

      <!-- Adopt Form Actions -->
      <button v-if="pet.status === 'Available' && !showForm" @click="showForm = true">Adopt</button>

      <AdoptForm v-if="showForm && isMember" :petId="pet.id" @submitted="onFormSubmitted"/>
      <p v-else-if="showForm && !isMember">
        You must be logged in as a member to submit an adoption request.
      </p>
    </div>

    <div v-else class="not-found">
      <p>Pet not found.</p>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import AdoptForm from "../components/AdoptForm.vue";
import { useAdoptions } from "../composables/useAdoptions";

export default {
  name: "PetDetailsView",

  components: { AdoptForm },
  props: { pet: Object },
  data() { return { showForm: false } },
  methods: {
    onFormSubmitted() {
      this.showForm = false
    }
  },

  setup() {
    const route = useRoute();
    const router = useRouter();

    const petId = Number(route.params.id);

    // Load pets (LocalStorage)
    const pets = JSON.parse(localStorage.getItem("pets") || "[]");
    const pet = pets.find((p) => p.id === petId);

    // Auth roles
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const isUser = user && user.role === "user";
    const isAdmin = user && user.role === "admin";
    const isMember = user && user.role === "member";

    // Likes
    const likedPets = JSON.parse(localStorage.getItem("likedPets") || "[]");
    const isLiked = likedPets.includes(petId);

    const { adoptions, updateAdoption } = useAdoptions()

    function toggleLike() {
      let updatedLikes = [...likedPets];

      if (isLiked) {
        updatedLikes = updatedLikes.filter((id) => id !== petId);
      } else {
        updatedLikes.push(petId);
      }

      localStorage.setItem("likedPets", JSON.stringify(updatedLikes));
      location.reload();
    }

    function goToEdit() {
      router.push(`/pets/edit/${petId}`);
    }

    function deletePet() {
      const updated = pets.filter((p) => p.id !== petId);
      localStorage.setItem("pets", JSON.stringify(updated));
      router.push("/pets");
    }

    // Compute pending requests dynamically
    const pending = computed(() =>
      adoptions.value.filter(a => a.status === 'Pending')
    )

    // Approve adoption
    const approve = (adopt) => {
      updateAdoption({ ...adopt, status: 'Approved' })
      alert(`${adopt.name}'s adoption request has been approved! Pet is now adopted.`)
    }

    // Reject adoption
    const reject = (adopt) => {
      updateAdoption({ ...adopt, status: 'Rejected' })
      alert(`${adopt.name}'s adoption request has been rejected.`)
    }

    return { pet, isAdmin, isMember, isUser, isLiked, toggleLike, goToEdit, deletePet, pending, approve, reject};
  },
};
</script>

<style scoped>
.pet-details {
  padding: 20px;
}

.details-container {
  max-width: 600px;
  margin: auto;
  text-align: center;
}

.pet-img {
  width: 100%;
  max-height: 280px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 12px;
}

.btn {
  padding: 10px 16px;
  border: none;
  cursor: pointer;
  margin: 6px;
  border-radius: 6px;
}

.edit { background: #ffc107; }
.delete { background: #dc3545; color: #fff; }
.like-btn { background: #ffdde0; }
.admin-actions { margin-top: 20px; }

.not-found {
  text-align: center;
  padding: 40px;
}
</style>
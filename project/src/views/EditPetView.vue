<template>
  <div class="container my-4">
    <h2>Edit Pet</h2>
    <div v-if="admin">
      <PetForm mode="edit" :pet="pet" @save="saveEdit" />
    </div>

    <p v-else class="text-danger">Access denied. Admin only.</p>
    <p v-if="notFound" class="text-danger mt-3">Pet not found.</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PetForm from '../components/PetForm.vue';
import { usePets } from '../composables/usePets';
import { useAuth } from '../composables/useAuth';

const route = useRoute();
const router = useRouter();
const { findPetById, updatePet } = usePets();
const { isAdmin } = useAuth();  // <-- import here

const pet = ref(null);
const notFound = ref(false);

// Optional: create a computed boolean for template
const admin = computed(() => isAdmin());

onMounted(() => {
  const id = Number(route.params.id);
  const found = findPetById(id);

  if (found) {
    pet.value = { ...found }; // copy so editing doesn’t live-update list
  } else {
    notFound.value = true;
  }
});

function saveEdit(updatedPet) {
  const ok = updatePet(updatedPet);

  if (ok) {
    router.push({ path: '/' }); // OR { name: 'Home' } if route is named
  } else {
    alert("Failed to update — pet not found or ID missing.");
  }
}

function onCancel() {
  router.back();
}
</script>
<template>
  <div class="card p-3 mt-4 shadow-sm" :class="{ 'border-success': mode === 'add', 'border-warning': mode === 'edit' }">
    <h4 class="mb-3">{{ mode === 'add' ? 'Add New Pet' : 'Edit Pet' }}</h4>

    <form @submit.prevent="onSubmit">
      <!-- Pet Name -->
      <div class="mb-3">
        <label for="p_name" class="form-label">Pet Name</label>
        <input
          id="p_name"
          v-model="localPet.name"
          type="text"
          class="form-control"
          placeholder="Enter pet name"
        />
        <div class="text-danger mt-1" v-if="errors.name">{{ errors.name }}</div>
      </div>

      <!-- Pet Type -->
      <div class="mb-3">
        <label for="p_type" class="form-label">Pet Type</label>
        <select id="p_type" v-model="localPet.type" class="form-select">
          <option disabled value="">Select type...</option>
          <option>Dog</option>
          <option>Cat</option>
          <option>Bird</option>
          <option>Other</option>
        </select>
        <div class="text-danger mt-1" v-if="errors.type">{{ errors.type }}</div>
      </div>

      <!-- Status -->
      <div class="mb-3">
        <label for="p_status" class="form-label">Status</label>
        <select id="p_status" v-model="localPet.status" class="form-select">
          <option disabled value="">Select status...</option>
          <option>Available</option>
          <option>Adopted</option>
        </select>
        <div class="text-danger mt-1" v-if="errors.status">{{ errors.status }}</div>
      </div>

      <!-- City -->
      <div class="mb-3">
        <label for="p_city" class="form-label">City</label>
        <select id="p_city" v-model="localPet.city" class="form-select">
          <option disabled value="">Select city...</option>
          <option>Melbourne</option>
          <option>Sydney</option>
          <option>Brisbane</option>
          <option>Perth</option>
          <option>Adelaide</option>
          <option>Other</option>
        </select>
        <div class="text-danger mt-1" v-if="errors.city">{{ errors.city }}</div>
      </div>

      <!-- Description -->
      <div class="mb-3">
        <label for="p_description" class="form-label">Description</label>
        <textarea
          id="p_description"
          v-model="localPet.description"
          class="form-control"
          placeholder="Short description"
        ></textarea>
      </div>

      <!-- Rescue Date -->
      <div class="mb-3">
        <label for="p_date" class="form-label">Rescue Date</label>
        <input id="p_date" v-model="localPet.rescueDate" type="date" class="form-control" />
      </div>

      <!-- Buttons -->
      <div class="d-flex gap-2">
        <button class="btn" :class="mode === 'add' ? 'btn-primary' : 'btn-success'" type="submit">
          {{ mode === 'add' ? 'Add Pet' : 'Save Changes' }}
        </button>

        <button v-if="mode === 'edit'" class="btn btn-secondary" type="button" @click="$emit('cancel')">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';

const props = defineProps({
  mode: { type: String, default: 'add' },
  pet: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['save', 'cancel']);

const localPet = reactive({
  id: null,
  name: '',
  type: '',
  status: '',
  city: '',
  description: '',
  rescueDate: ''
});

const errors = reactive({
  name: '',
  type: '',
  status: '',
  city: ''
});

// Reset form
function resetForm() {
  Object.assign(localPet, { id: null, name: '', type: '', status: '', city: '', description: '', rescueDate: '' });
  Object.keys(errors).forEach(key => (errors[key] = ''));
}

// Watch for prop changes (edit mode)
watch(
  () => props.pet,
  (p) => {
    if (p && Object.keys(p).length) Object.assign(localPet, p);
    else resetForm();
  },
  { immediate: true }
);

function validate() {
  let valid = true;
  errors.name = !localPet.name.trim() ? 'Pet name is required.' : localPet.name.length > 20 ? 'Pet name cannot exceed 20 characters.' : '';
  errors.type = !localPet.type ? 'Pet type is required.' : '';
  errors.status = !localPet.status ? 'Pet status is required.' : '';
  return Object.values(errors).every(e => !e);
}

function onSubmit() {
  if (!validate()) return;
  emit('save', { ...localPet, id: localPet.id ?? undefined });
  if (props.mode === 'add') resetForm();
}
</script>

<style scoped>
.card { max-width: 680px; }
.text-danger { font-size: 0.9em; }
</style>
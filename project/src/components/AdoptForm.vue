<template>
  <div class="adopt-form card shadow-sm p-4 my-3">
    <h3 class="text-center mb-4">Adoption Form</h3>
    <form @submit.prevent="submit" novalidate>
      <div class="mb-3">
        <label for="u_name" class="form-label">Your Name</label>
        <input
          id="u_name"
          name="name"
          v-model="formData.name"
          class="form-control"
          required
          maxlength="20"
          pattern="[A-Za-z ]+"
        />
        <div class="text-danger small" v-if="errors.name">{{ errors.name }}</div>
      </div>

      <div class="mb-3">
        <label for="p_name" class="form-label">Pet Name</label>
        <input
          id="p_name"
          name="petName"
          v-model="formData.petName"
          class="form-control"
          required
          maxlength="20"
          pattern="[A-Za-z ]+"
        />
        <div class="text-danger small" v-if="errors.petName">{{ errors.petName }}</div>
      </div>

      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input
          id="email"
          name="email"
          v-model="formData.email"
          type="email"
          class="form-control"
          required
        />
        <div class="text-danger small" v-if="errors.email">{{ errors.email }}</div>
      </div>

      <div class="mb-3">
        <label for="phone" class="form-label">Phone</label>
        <input
          id="phone"
          name="phone"
          v-model="formData.phone"
          type="tel"
          class="form-control"
          required
          pattern="^\+09\d+$"
        />
        <div class="text-danger small" v-if="errors.phone">{{ errors.phone }}</div>
      </div>

      <div class="mb-3">
        <label for="address" class="form-label">Address</label>
        <input
          id="address"
          name="address"
          v-model="formData.address"
          class="form-control"
        />
      </div>

      <button type="submit" class="btn btn-primary w-100 mt-3">Submit Adoption Request</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useAdoptions } from '../composables/useAdoptions.js'

export default {
  props: ['petId'],
  emits: ['submitted'],
  setup(props, { emit }) {
    const formData = ref({
      name: '',
      petName: '',
      email: '',
      phone: '',
      address: ''
    })
    const errors = ref({
      name: '',
      petName: '',
      email: '',
      phone: '',
      address: ''
    })

    const { addAdoption } = useAdoptions()

    const validate = () => {
      errors.value = { name: '', petName: '', email: '', phone: '', address: '' }
      const nameRegex = /^[A-Za-z\s]{1,20}$/
      if (!nameRegex.test(formData.value.name)) {
        errors.value.name = 'Name is required, only letters/spaces allowed, max 20 chars.'
      }
      if (!nameRegex.test(formData.value.petName)) {
        errors.value.petName = 'Pet name is required, only letters/spaces allowed, max 20 chars.'
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.value.email)) {
        errors.value.email = 'Please enter a valid email address.'
      }
      const phoneRegex = /^\+09\d+$/
      if (!phoneRegex.test(formData.value.phone)) {
        errors.value.phone = "Phone is required and must start with '+09' followed by digits."
      }
      return Object.values(errors.value).every((e) => !e)
    }

    const submit = () => {
      if (!validate()) return
      addAdoption({ petId: props.petId, ...formData.value })
      alert('Your adoption request is pending admin approval!')
      formData.value = { name: '', petName: '', email: '', phone: '', address: '' }
      emit('submitted')
    }

    return { formData, errors, submit }
  }
}
</script>

<style scoped>
.adopt-form {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.adopt-form h3 {
  font-weight: 600;
  color: #333;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0069d9;
  border-color: #0062cc;
}

.form-label {
  font-weight: 500;
}

.text-danger {
  font-size: 0.85rem;
  margin-top: 2px;
}
</style>
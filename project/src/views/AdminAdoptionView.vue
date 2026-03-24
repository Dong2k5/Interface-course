<template>
  <div>
    <h2>Pending Adoptions</h2>
    <div v-for="adopt in pending" :key="adopt.id" class="adoption-item">
      <p><strong>{{ adopt.name }}</strong> wants to adopt <em>pet ID: {{ adopt.petId }}</em></p>
      <button @click="approve(adopt)">Approve</button>
      <button @click="reject(adopt)">Reject</button>
    </div>
    <p v-if="pending.length === 0">No pending adoptions</p>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useAdoptions } from '../composables/useAdoptions.js'

export default {
  setup() {
    const { adoptions, updateAdoption } = useAdoptions()

    // Only show pending requests
    const pending = computed(() =>
      adoptions.value.filter(a => a.status === 'Pending')
    )

    const approve = (adopt) => {
      updateAdoption({ ...adopt, status: 'Approved' })
      alert(`${adopt.name}'s adoption request has been approved.`)
    }

    const reject = (adopt) => {
      updateAdoption({ ...adopt, status: 'Rejected' })
      alert(`${adopt.name}'s adoption request has been rejected.`)
    }

    return { pending, approve, reject }
  }
}
</script>
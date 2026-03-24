<template>
  <form class="mb-3" @submit.prevent>
    <div class="row g-2 align-items-end">
      <!-- Search -->
      <div class="col-12 col-md-4">
        <input
          v-model="local.q"
          @input="emitChange"
          class="form-control"
          placeholder="Search name / type / city..."
        />
      </div>

      <!-- Type -->
      <div class="col-6 col-md-2">
        <select v-model="local.type" @change="emitChange" class="form-select">
          <option value="">All types</option>
          <option>Dog</option>
          <option>Cat</option>
          <option>Bird</option>
          <option>Other</option>
        </select>
      </div>

      <!-- Status -->
      <div class="col-6 col-md-2">
        <select v-model="local.status" @change="emitChange" class="form-select">
          <option value="">All Status</option>
          <option>Available</option>
          <option>Adopted</option>
        </select>
      </div>

      <!-- Date range (optional) -->
      <div class="col-6 col-md-2">
        <input type="date" v-model="local.from" @change="emitChange" class="form-control" />
      </div>
      <div class="col-6 col-md-2">
        <input type="date" v-model="local.to" @change="emitChange" class="form-control" />
      </div>

      <!-- Reset -->
      <div class="col-12 col-md-2 text-end">
        <button class="btn btn-outline-secondary" type="button" @click="reset">Clear</button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  initial: {
    type: Object,
    default: () => ({ q: '', type: '', status: '', from: '', to: '' })
  }
})

const emit = defineEmits(['change'])

const local = reactive({ ...props.initial })

function emitChange() {
  emit('change', { ...local })
}

watch(() => props.initial, (v) => {
  Object.assign(local, v)
})

function reset() {
  Object.assign(local, { q: '', type: '', status: '', from: '', to: '' })
  emitChange()
}
</script>
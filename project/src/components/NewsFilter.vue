<template>
  <form @submit.prevent class="mb-3">
    <div class="row g-2 align-items-center">
      <div class="col-md-6">
        <input v-model="local.q" @input="emitChange" class="form-control" placeholder="Search news..." />
      </div>
      <div class="col-md-3">
        <select v-model="local.category" @change="emitChange" class="form-select">
          <option value="">All Categories</option>
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
      <div class="col-md-3 text-end">
        <button type="button" class="btn btn-outline-secondary" @click="clearDates">Clear Dates</button>
      </div>
    </div>

    <div class="row g-2 mt-2">
      <div class="col-md-3">
        <input type="date" v-model="local.from" @change="emitChange" class="form-control" />
      </div>
      <div class="col-md-3">
        <input type="date" v-model="local.to" @change="emitChange" class="form-control" />
      </div>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  categories: { type: Array, default: () => [] },
  initial: { type: Object, default: () => ({ q: '', category: '', from: '', to: '' }) }
})
const emit = defineEmits(['change'])

const local = reactive({ ...props.initial })

function emitChange() {
  emit('change', { ...local })
}

watch(() => props.initial, (v) => Object.assign(local, v))

function clearDates() {
  local.from = ''
  local.to = ''
  emitChange()
}
</script>
<template>
  <div class="row g-4">
    <div v-for="item in news" :key="item.id" class="col-12 col-md-6 col-lg-4 d-flex">
      <NewsCard :news="item" @deleted="onDelete" />
    </div>
  </div>
</template>

<script setup>
import NewsCard from './NewsCard.vue'
const props = defineProps({
  news: { type: Array, required: true }
})
const emit = defineEmits(['delete'])

function onDelete(id) {
  emit('delete', id)
}
</script>
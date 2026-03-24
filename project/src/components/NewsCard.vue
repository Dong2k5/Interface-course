<script setup>
defineProps({
  news: Object
})
</script>

<template>
  <div class="news-card border rounded shadow-sm p-3 d-flex flex-column h-100">
    <p class="text-muted mb-1">{{ news.date }}</p>
    <h5 class="fw-bold">{{ news.title }}</h5>
    <span class="badge bg-info mb-2">{{ news.category }}</span>
    <p class="mb-2">{{ news.content }}</p>
    <router-link :to="`/news/edit/${news.id}`" class="btn btn-sm btn-outline-primary">
      Edit
    </router-link>
  </div>
</template>

<style scoped>
.news-card {
  transition: transform 0.2s, box-shadow 0.2s;
}
.news-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}
</style>
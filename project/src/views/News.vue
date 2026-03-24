<template>
  <div class="container py-4">
    <h2>News Updates</h2>
    <p class="lead fst-italic">Stay updated with our events, adoptions, and tips!</p>

    <!-- Add News Button -->
    <div class="my-3">
      <button class="btn btn-primary" @click="toggleForm">
        {{ showForm ? 'Close Form' : '+ Add News' }}
      </button>
    </div>

    <!-- Add News Form -->
    <NewsForm
      v-if="showForm"
      mode="add"
      @save="onAddNews"
      @cancel="showForm = false"
    />

    <!-- Search & Filters -->
    <section class="container my-4">
      <div class="row g-3 align-items-center">
        <div class="col-md-6">
          <input v-model="search" type="text" class="form-control" placeholder="Search news..." />
        </div>
        <div class="col-md-3">
          <select v-model="filterCategory" class="form-select">
            <option value="">All Categories</option>
            <option v-for="cate in categories" :key="cate" :value="cate">{{ cate }}</option>
          </select>
        </div>
        <div class="col-md-3 text-end">
          <span class="text-muted">Page {{ currentPage }} of {{ totalPages }}</span>
        </div>
      </div>

      <!-- Date range filter -->
      <div class="row g-3 align-items-center mt-3">
        <div class="col-md-3">
          <input v-model="startDate" type="date" class="form-control" />
        </div>
        <div class="col-md-3">
          <input v-model="endDate" type="date" class="form-control" />
        </div>
        <div class="col-md-6 text-end">
          <button class="btn btn-outline-secondary" @click="clearDates">Clear dates</button>
        </div>
      </div>
    </section>

    <!-- News Cards -->
    <section class="container my-4">
      <div class="row g-4">
        <div
          v-for="item in paginatedNews"
          :key="item.id"
          class="col-12 col-md-6 col-lg-4 d-flex"
        >
          <NewsCard :news="item" />
        </div>
      </div>
    </section>

    <!-- Pagination -->
    <section class="container my-4 text-center">
      <button class="btn btn-secondary me-2" :disabled="currentPage === 1" @click="currentPage--">Prev</button>
      <button class="btn btn-secondary" :disabled="currentPage === totalPages" @click="currentPage++">Next</button>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import NewsCard from '../components/NewsCard.vue'
import NewsForm from '../components/NewsForm.vue'
import { useNews } from '../composables/useNews.js'

// news store
const { news, addNews } = useNews()

// UI states
const showForm = ref(false)
const search = ref('')
const filterCategory = ref('')
const startDate = ref('')
const endDate = ref('')
const currentPage = ref(1)
const itemsPerPage = 6

function toggleForm() {
  showForm.value = !showForm.value
}

function onAddNews(data) {
  addNews(data)
  showForm.value = false
}

// categories
const categories = computed(() =>
  [...new Set(news.value.map(n => n.category).filter(Boolean))]
)

// filtered news
const filteredNews = computed(() => {
  const s = startDate.value ? new Date(startDate.value) : null
  let e = endDate.value ? new Date(endDate.value) : null

  if (e) e.setHours(23, 59, 59, 999)

  return news.value.filter(n => {
    const matchesSearch = Object.values(n)
      .some(v => v?.toString().toLowerCase().includes(search.value.toLowerCase()))

    const matchesCategory =
      filterCategory.value ? n.category === filterCategory.value : true

    const itemDate = n.date ? new Date(n.date) : null

    const matchesDate =
      !itemDate ||
      (!s || itemDate >= s) &&
      (!e || itemDate <= e)

    return matchesSearch && matchesCategory && matchesDate
  })
})

// pagination
const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredNews.value.length / itemsPerPage))
)

const paginatedNews = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredNews.value.slice(start, start + itemsPerPage)
})

watch([search, filterCategory, startDate, endDate], () => {
  currentPage.value = 1
})

function clearDates() {
  startDate.value = ''
  endDate.value = ''
}
</script>
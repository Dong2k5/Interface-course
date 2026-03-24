<template>
  <form @submit.prevent="handleSubmit" class="card p-4 shadow-sm">

    <!-- Title -->
    <div class="mb-3">
      <label for="title" class="form-label fw-bold">Title</label>
      <input id="title" v-model="localNews.title" type="text" class="form-control" placeholder="News title" />
      <div class="text-danger mt-1" v-if="errors.title">{{ errors.title }}</div>
    </div>

    <!-- Content -->
    <div class="mb-3">
      <label for="content" class="form-label fw-bold">Content</label>
      <textarea id="content" v-model="localNews.content" class="form-control" rows="4" placeholder="Write the news content..."></textarea>
      <div class="text-danger mt-1" v-if="errors.content">{{ errors.content }}</div>
    </div>

    <!-- Category -->
    <div class="mb-3">
      <label for="category" class="form-label fw-bold">Category</label>
      <input id="category" v-model="localNews.category" type="text" class="form-control" placeholder="Event, Tips, Announcement..." />
      <div class="text-danger mt-1" v-if="errors.category">{{ errors.category }}</div>
    </div>

    <!-- Date -->
    <div class="mb-3">
      <label for="date" class="form-label fw-bold">Date</label>
      <input id="date" v-model="localNews.date" type="date" class="form-control" />
      <div class="text-danger mt-1" v-if="errors.date">{{ errors.date }}</div>
    </div>

    <!-- Buttons -->
    <div class="mt-4 d-flex justify-content-between">
      <button class="btn btn-primary" type="submit">{{ mode === 'edit' ? 'Save Changes' : 'Add News' }}</button>
      <button class="btn btn-outline-secondary" type="button" @click="$emit('cancel')">Cancel</button>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  mode: { type: String, default: 'add' },
  news: { type: Object, default: null }
})

const emit = defineEmits(['save', 'cancel'])

const localNews = reactive({
  id: props.news?.id ?? null,
  title: props.news?.title ?? '',
  content: props.news?.content ?? '',
  category: props.news?.category ?? '',
  date: props.news?.date ?? ''
})

const errors = reactive({
  title: '',
  content: '',
  category: '',
  date: ''
})

watch(
  () => props.news,
  (n) => {
    Object.assign(localNews, { id: n?.id ?? null, title: n?.title ?? '', content: n?.content ?? '', category: n?.category ?? '', date: n?.date ?? '' })
  },
  { immediate: true }
)

function validate() {
  errors.title = !localNews.title.trim() ? 'Title is required.' : '';
  errors.content = !localNews.content.trim() ? 'Content is required.' : '';
  errors.category = !localNews.category.trim() ? 'Category is required.' : '';
  errors.date = !localNews.date ? 'Date is required.' : '';
  return Object.values(errors).every(e => !e)
}

function handleSubmit() {
  if (!validate()) return;
  emit('save', { ...localNews })
}
</script>

<style scoped>
.card { max-width: 650px; margin: 0 auto; }
.text-danger { font-size: 0.9em; }
</style>
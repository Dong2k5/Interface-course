<template>
  <div class="container my-4">
    <h2>Edit News</h2>

    <NewsForm 
        v-if ="newsItem"
        mode="edit"
        :news="newsItem"
        @save="onSave"
        @cancel="onCancel"
    />

    <p v-if="notFound" class="text-danger mt-3">News item not found.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NewsForm from '../components/NewsForm.vue'
import { useNews } from '../composables/useNews'

const route = useRoute()
const router = useRouter()
const { findNewsById, updateNews } = useNews()

const newsItem = ref(null)
const notFound = ref(false)

onMounted(() => {
  const id = Number(route.params.id)
  const found = findNewsById(id)

  if (found) {
    // Copy so editing doesn't mutate original until saved
    newsItem.value = { ...found }
  } else {
    notFound.value = true
  }
})

function onSave(updatedNews) {
  const success = updateNews(updatedNews)

  if (success) {
    router.push('/news')   // send user back to the news list
  } else {
    alert("Failed to update — news item not found.")
  }
}

function onCancel() {
  router.back()
}
</script>
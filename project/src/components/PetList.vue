<template>
  <div class="row">
    <PetCard
      v-for="pet in pets"
      :key="pet.id"
      :pet="pet"
      :highlight-on="highlightId"
      @deleted="onDelete"
      @liked="onLike"
    />
  </div>
</template>

<script setup>
import PetCard from './PetCard.vue';
const props = defineProps({
  pets: { type: Array, required: true },
  highlightId: { type: [Number, String], default: null }
});
const emit = defineEmits(['delete', 'update:pets'])

function onDelete(id) {
  emit('delete', id);
}

function onLike(pet) {
  // save updated pets array to localStorage
  localStorage.setItem('pets', JSON.stringify(props.pets))
}
</script>
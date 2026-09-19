<script setup>
import { onMounted } from 'vue'
import HeaderGenre from '@/components/genre/genreList/HeaderGenre.vue'
import MainGenre from '@/components/genre/genreList/MainGenre.vue'
import { useGenresStore } from '@/stores/genreStore'

const genresStore = useGenresStore()

onMounted(async () => {
  await genresStore.fetchAllGenres()
})
</script>
<template>
  <main class="mx-auto w-full min-w-0 overflow-x-auto">
    <HeaderGenre />
    <MainGenre />
  </main>
</template>
>

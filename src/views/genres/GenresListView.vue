<script setup lang="ts">
import { onMounted } from 'vue'
import HeaderGenre from '@/components/genre/genreList/HeaderGenre.vue'
import MainGenre from '@/components/genre/genreList/MainGenre.vue'
import { useGenresStore } from '@/stores/genreStore'

const genresStore = useGenresStore()

const loadData = async () => await genresStore.fetchAllGenres()

onMounted(loadData)

</script>
<template>
    <main class="mx-auto w-full mb-6 min-w-0 overflow-x-auto">
        <HeaderGenre />
        <MainGenre />
    </main>
</template>
>

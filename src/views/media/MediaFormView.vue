<!-- frontend/vue-dashbord/src/views/media/MediaFormView.vue -->
<script setup>
import { useRoute } from 'vue-router'

import NotFoundView from '@/views/errors/NotFoundView.vue'
import MediaModel from '@/components/media/mediaForm/MediaModel.vue'
import GenresModal from '@/components/genre/GenresModal.vue'
import SeasonModal from '@/components/media/mediaForm/SeasonModal.vue'
import EpisodeModal from '@/components/media/mediaForm/EpisodeModal.vue'
import LinkModal from '@/components/media/mediaForm/LinkModal.vue'

const route = useRoute()

</script>
<template>
    <main>
        <div>
            <div v-if="route.name === 'addMedia' || route.name === 'editMedia'">
                <MediaModel />
            </div>
            <div v-else-if="route.name === 'addGenre' || route.name === 'editGenre'">
                <GenresModal />
            </div>
            <div v-else-if="route.name === 'addSeason' || route.name === 'editSeason'">
                <SeasonModal />
            </div>
            <div v-else-if="route.name === 'addEpisode' || route.name === 'editEpisode'">
                <EpisodeModal />
            </div>
            <div v-else-if="route.name === 'addLink' || route.name === 'editLink'">
                <LinkModal />
            </div>
            <div v-else>
                <NotFoundView />
            </div>
        </div>
    </main>
</template>

<script setup>
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';

import HeaderProfile from '@/components/profile/HeaderProfile.vue';
import EditProfileDetails from '@/components/profile/EditProfileDetails.vue';
import ShowActiveSessions from '@/components/profile/ShowActiveSessions.vue';

const userStore = useUserStore()
const sessions = () => userStore.getSessionsByUserId()

onMounted(async () => {
  await sessions()
})

</script>
<template>
  <main>
    <HeaderProfile />
    <EditProfileDetails />
    <ShowActiveSessions />
  </main>
</template>

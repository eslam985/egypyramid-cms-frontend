<script setup>
import HeaderProfile from '@/components/profile/HeaderProfile.vue';
import EditProfileDetails from '@/components/profile/EditProfileDetails.vue';
import ShowActiveSessions from '@/components/profile/ShowActiveSessions.vue';
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';

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

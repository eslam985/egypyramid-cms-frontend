<script setup>



</script>
<template>
<!-- نافذة عرض سجل الصور المرفوعة سابقاً (History Modal) -->
<div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
  <div class="bg-white dark:bg-[#151f35] border border-line rounded-3xl max-w-md w-full p-fluid-section shadow-2xl space-y-6 animate-fade-in">

    <!-- رأس النافذة -->
    <div class="flex justify-between items-center border-b border-line pb-3">
      <div class="flex items-center gap-2">
        <History class="text-accent" />
        <span class="text-fluid-h3">Photo History</span>
      </div>
      <button @click="isModalOpen = false" class="text-sub hover:text-text-primary text-fluid-p cursor-pointer">&times;</button>
    </div>

    <!-- شبكة عرض الصور القديمة -->
    <div class="grid grid-cols-3 gap-4 max-h-[300px] overflow-y-auto p-1">
      <div
        v-for="(url, index) in userStore.userInfo?.avatar_history"
        :key="index"
        class="relative aspect-square rounded-full overflow-hidden border border-line group cursor-pointer shadow-sm hover:border-accent transition-all duration-300"
        @click="handleSelectHistory(url)"
      >
        <img :src="url" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" alt="Previous avatar">
        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span class="text-white text-[10px] font-medium bg-accent px-2 py-0.5 rounded-full">Select</span>
        </div>
      </div>
    </div>

    <!-- تذييل النافذة -->
    <div class="flex justify-end pt-3 border-t border-line">
      <button type="button" @click="isModalOpen = false" class="btn-secondary text-fluid-xs px-4 py-2">Close</button>
    </div>

  </div>

</div>




</template>

<template>
  <Transition name="fade">
    <div v-if="notif.show" :class="['fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg flex items-center gap-2',
    notif.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white']">
    <i :class="notif.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
    <span>{{ notif.message }}</span>
  </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import { useNotificationStore } from '../stores/notification'

const notif = computed(() => useNotificationStore())
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>

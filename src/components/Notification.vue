<template>
  <div v-if="notif.show" :class="['fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg transition-all flex items-center gap-2',
    notif.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white']">
    <i :class="notif.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
    <span>{{ notif.message }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useNotificationStore } from '../stores/notification'

const notif = computed(() => useNotificationStore())
</script>

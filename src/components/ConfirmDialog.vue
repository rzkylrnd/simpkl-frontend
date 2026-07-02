<template>
  <Transition name="fade">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="fixed inset-0 bg-black/50" @click="$emit('cancel')"></div>
      <div :class="['relative z-10 w-full max-w-sm mx-4 rounded-lg shadow-xl p-6', darkMode ? 'bg-gray-800' : 'bg-white']">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <i class="fas fa-exclamation-triangle text-red-600 dark:text-red-400"></i>
          </div>
          <div>
            <h4 class="font-semibold">{{ title }}</h4>
            <p class="text-sm" :class="darkMode ? 'text-gray-400' : 'text-gray-600'">{{ message }}</p>
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <button @click="$emit('cancel')" :class="['px-4 py-2 rounded text-sm font-medium', darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300']">Batal</button>
          <button @click="$emit('confirm')" class="px-4 py-2 rounded text-sm font-medium bg-red-600 text-white hover:bg-red-700">Ya, Logout</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '../stores/theme'

const props = defineProps({
  show: Boolean,
  title: { type: String, default: 'Konfirmasi' },
  message: { type: String, default: 'Yakin ingin melanjutkan?' },
})

defineEmits(['confirm', 'cancel'])

const themeStore = useThemeStore()
const darkMode = computed(() => themeStore.darkMode)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
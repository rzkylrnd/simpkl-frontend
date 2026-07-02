<template>
  <router-view />
</template>

<script setup>
import { watch } from 'vue'
import { useThemeStore } from './stores/theme'
import { useAuthStore } from './stores/auth'

const themeStore = useThemeStore()
const authStore = useAuthStore()

watch(() => themeStore.darkMode, (val) => {
  document.documentElement.classList.toggle('dark', val)
}, { immediate: true })

if (authStore.token) {
  authStore.fetchUser()
}
</script>

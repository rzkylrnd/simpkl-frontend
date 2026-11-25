<template>
  <router-view />
</template>

<script setup>
import { useAuthStore } from './stores/auth'
const authStore = useAuthStore()

if (authStore.token) {
  authStore.fetchUser()
}
</script>

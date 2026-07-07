<template>
  <div :class="['min-h-screen flex items-center justify-center', darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-600 to-blue-800']">
    <div :class="['p-8 rounded-lg shadow-lg w-full max-w-md', darkMode ? 'bg-gray-800' : 'bg-white']">
      <h2 :class="['text-2xl font-bold text-center mb-6', darkMode ? 'text-white' : 'text-blue-700']">SIMPKL</h2>
      <p :class="['text-center mb-6', darkMode ? 'text-gray-400' : 'text-gray-500']">Sistem Informasi Praktek Kerja Lapangan</p>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label :class="['block text-sm font-medium mb-1', darkMode ? 'text-gray-300' : 'text-gray-700']">Email</label>
          <input v-model="email" type="text" required
            :class="['w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500', darkMode ? 'bg-gray-700 border-gray-600 text-white' : '']" />
        </div>
        <div class="mb-6">
          <label :class="['block text-sm font-medium mb-1', darkMode ? 'text-gray-300' : 'text-gray-700']">Password</label>
          <input v-model="password" type="password" required
            :class="['w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500', darkMode ? 'bg-gray-700 border-gray-600 text-white' : '']" />
        </div>
        <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>
        <button type="submit" :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
          {{ loading ? 'Loading...' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'

const themeStore = useThemeStore()
const darkMode = computed(() => themeStore.darkMode)

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const authStore = useAuthStore()
const router = useRouter()

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await authStore.login(email.value, password.value)
    router.push('/')
  } catch (e) {
    error.value = e.response?.data?.errors?.email?.[0] || 'Login gagal'
  } finally {
    loading.value = false
  }
}
</script>

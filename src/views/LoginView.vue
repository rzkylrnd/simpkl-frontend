<template>
  <div :class="['min-h-screen flex items-center justify-center', darkMode ? 'bg-gray-900' : '']" :style="!darkMode ? 'background: linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)' : ''">
    <div :class="['p-8 rounded-2xl shadow-2xl w-full max-w-md', darkMode ? 'bg-gray-800' : 'bg-white/95 backdrop-blur-sm']">
      <div class="text-center mb-6">
        <div :class="['w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl', darkMode ? 'bg-blue-600 text-white' : 'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/30']">
          <i class="fas fa-graduation-cap"></i>
        </div>
        <h2 :class="['text-2xl font-bold', darkMode ? 'text-white' : 'text-gray-800']">SIMPKL</h2>
        <p :class="['text-sm mt-1', darkMode ? 'text-gray-400' : 'text-gray-500']">Field Work Practice Information System</p>
      </div>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label :class="['block text-sm font-medium mb-1', darkMode ? 'text-gray-300' : 'text-gray-700']">Email</label>
          <input v-model="email" type="text" required placeholder="Enter email"
            :class="['w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition', darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'light-input border-gray-200 placeholder-gray-400']" />
        </div>
        <div class="mb-6">
          <label :class="['block text-sm font-medium mb-1', darkMode ? 'text-gray-300' : 'text-gray-700']">Password</label>
          <div class="relative">
            <input v-model="password" :type="showPassword ? 'text' : 'password'" required placeholder="Enter password"
              :class="['w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 transition', darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'light-input border-gray-200 placeholder-gray-400']" />
            <button type="button" @click="showPassword = !showPassword"
              :class="['absolute inset-y-0 right-0 px-3 flex items-center', darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600']">
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>
        <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>
        <button type="submit" :disabled="loading"
          :class="['w-full text-white py-2.5 rounded-lg font-medium disabled:opacity-50 transition-all', darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'light-btn-primary']">
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
const showPassword = ref(false)
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
    error.value = e.response?.data?.errors?.email?.[0] || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div :class="['flex h-screen', darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900']">
    <Sidebar />
    <div class="flex-1 flex flex-col">
      <header :class="['flex items-center justify-between px-6 py-3 shadow', darkMode ? 'bg-gray-800' : 'bg-white']">
        <h1 class="text-xl font-semibold">{{ pageTitle }}</h1>
        <div class="flex items-center gap-4">
          <button @click="themeStore.toggle()" class="px-3 py-1 rounded border text-sm"
            :class="darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-200'">
            {{ darkMode ? 'Terang' : 'Gelap' }}
          </button>
          <span>{{ authStore.user?.nama }}</span>
          <button @click="handleLogout" class="px-3 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600">Logout</button>
        </div>
      </header>
      <main class="flex-1 p-6 overflow-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import Sidebar from '../components/Sidebar.vue'
import axios from 'axios'

const authStore = useAuthStore()
const themeStore = useThemeStore()
const router = useRouter()
const route = useRoute()
const darkMode = computed(() => themeStore.darkMode)

const pageTitle = computed(() => {
  const titles = {
    Dashboard: 'Dashboard',
    Users: 'Data Users',
    Sekolah: 'Data Sekolah',
    TempatPkl: 'Data Tempat PKL',
    Siswa: 'Data Siswa',
    Penempatan: 'Data Penempatan',
    Presensi: 'Data Presensi',
    Jurnal: 'Data Jurnal',
    Laporan: 'Data Laporan',
    Penilaian: 'Data Penilaian',
    Profile: 'Profile',
  }
  return titles[route.name] || 'SIMPKL'
})

async function handleLogout() {
  try { await axios.post('/api/logout') } catch (e) {}
  authStore.logout()
  router.push('/login')
}
</script>

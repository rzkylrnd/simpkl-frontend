<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">Selamat Datang, {{ authStore.user?.nama }}</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="card in cards" :key="card.label" :class="['p-5 rounded-xl shadow-sm border transition-all hover:shadow-md hover:-translate-y-0.5', darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200']">
        <div class="flex items-center justify-between mb-3">
          <div :class="['w-10 h-10 rounded-lg flex items-center justify-center', card.bg]">
            <i :class="[card.icon, 'text-white']"></i>
          </div>
        </div>
        <p class="text-3xl font-bold">{{ stats[card.key] }}</p>
        <p :class="['text-sm mt-1', darkMode ? 'text-gray-400' : 'text-gray-500']">{{ card.label }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import axios from 'axios'

const authStore = useAuthStore()
const themeStore = useThemeStore()
const darkMode = computed(() => themeStore.darkMode)
const stats = ref({ siswa: 0, penempatan: 0, presensi: 0, laporan: 0 })

const cards = [
  { key: 'siswa', label: 'Total Siswa', icon: 'fas fa-user-graduate', bg: 'bg-blue-500' },
  { key: 'penempatan', label: 'Total Penempatan', icon: 'fas fa-map-marker-alt', bg: 'bg-green-500' },
  { key: 'presensi', label: 'Presensi Hari Ini', icon: 'fas fa-clipboard-check', bg: 'bg-yellow-500' },
  { key: 'laporan', label: 'Total Laporan', icon: 'fas fa-file-alt', bg: 'bg-purple-500' },
]

onMounted(async () => {
  try {
    const [siswa, penempatan, presensi, laporan] = await Promise.all([
      axios.get('/api/siswa'),
      axios.get('/api/penempatan'),
      axios.get('/api/presensi'),
      axios.get('/api/laporan'),
    ])
    stats.value = {
      siswa: siswa.data.data?.length || 0,
      penempatan: penempatan.data.data?.length || 0,
      presensi: presensi.data.data?.length || 0,
      laporan: laporan.data.data?.length || 0,
    }
  } catch (e) {}
})
</script>

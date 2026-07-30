<template>
  <div>
    <h2 class="text-2xl font-bold mb-1">{{ greeting }}, {{ authStore.user?.nama }}</h2>
    <p :class="['text-sm mb-6', darkMode ? 'text-gray-400' : 'text-gray-500']">{{ roleLabel }}</p>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

    <div>
      <h3 class="text-lg font-semibold mb-3">Aksi Cepat</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        <button v-for="act in quickActions" :key="act.label" @click="go(act.route)"
          :class="['flex items-center gap-3 p-4 rounded-xl border transition-all hover:shadow-md hover:-translate-y-0.5', darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50']">
          <div :class="['w-9 h-9 rounded-lg flex items-center justify-center text-sm', act.bg]">
            <i :class="[act.icon, 'text-white']"></i>
          </div>
          <span class="text-sm font-medium text-left">{{ act.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const darkMode = computed(() => themeStore.darkMode)
const stats = ref({ siswa: 0, penempatan: 0, presensi: 0, laporan: 0 })

const roleLabel = computed(() => {
  const labels = {
    admin: 'Administrator',
    siswa: 'Peserta PKL',
    guru_pembimbing: 'Guru Pembimbing',
    pembimbing_industri: 'Pembimbing Industri',
  }
  return labels[authStore.user?.role] || ''
})

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 10) return 'Selamat Pagi'
  if (h < 15) return 'Selamat Siang'
  if (h < 18) return 'Selamat Sore'
  return 'Selamat Malam'
})

const cards = [
  { key: 'siswa', label: 'Total Siswa', icon: 'fas fa-user-graduate', bg: 'bg-blue-500' },
  { key: 'penempatan', label: 'Total Penempatan', icon: 'fas fa-map-marker-alt', bg: 'bg-green-500' },
  { key: 'presensi', label: 'Presensi Hari Ini', icon: 'fas fa-clipboard-check', bg: 'bg-yellow-500' },
  { key: 'laporan', label: 'Total Laporan', icon: 'fas fa-file-alt', bg: 'bg-purple-500' },
]

const quickActions = computed(() => {
  const role = authStore.user?.role
  if (role === 'siswa') return [
    { label: 'Isi Presensi', icon: 'fas fa-clipboard-check', route: 'Presensi', bg: 'bg-yellow-500' },
    { label: 'Isi Jurnal', icon: 'fas fa-book', route: 'Jurnal', bg: 'bg-blue-500' },
    { label: 'Upload Laporan', icon: 'fas fa-file-upload', route: 'Laporan', bg: 'bg-purple-500' },
    { label: 'Lihat Penilaian', icon: 'fas fa-star', route: 'Penilaian', bg: 'bg-green-500' },
    { label: 'Profile Saya', icon: 'fas fa-user', route: 'Profile', bg: 'bg-gray-500' },
  ]
  if (role === 'guru_pembimbing') return [
    { label: 'Penilaian Siswa', icon: 'fas fa-star', route: 'Penilaian', bg: 'bg-green-500' },
    { label: 'Laporan Akhir', icon: 'fas fa-file-alt', route: 'Laporan', bg: 'bg-purple-500' },
    { label: 'Monitoring Presensi', icon: 'fas fa-clipboard-check', route: 'Presensi', bg: 'bg-yellow-500' },
    { label: 'Monitoring Jurnal', icon: 'fas fa-book', route: 'Jurnal', bg: 'bg-blue-500' },
  ]
  if (role === 'pembimbing_industri') return [
    { label: 'Validasi Presensi', icon: 'fas fa-clipboard-check', route: 'Presensi', bg: 'bg-yellow-500' },
    { label: 'Validasi Jurnal', icon: 'fas fa-book', route: 'Jurnal', bg: 'bg-blue-500' },
  ]
  if (role === 'admin') return [
    { label: 'Kelola Users', icon: 'fas fa-users', route: 'Users', bg: 'bg-blue-500' },
    { label: 'Data Siswa', icon: 'fas fa-user-graduate', route: 'Siswa', bg: 'bg-green-500' },
    { label: 'Data Penempatan', icon: 'fas fa-map-marker-alt', route: 'Penempatan', bg: 'bg-red-500' },
    { label: 'Data Sekolah', icon: 'fas fa-school', route: 'Sekolah', bg: 'bg-purple-500' },
    { label: 'Monitoring Presensi', icon: 'fas fa-clipboard-check', route: 'Presensi', bg: 'bg-yellow-500' },
  ]
  return []
})

function go(name) {
  router.push({ name })
}

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

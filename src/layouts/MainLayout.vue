<template>
  <div class="flex h-screen text-gray-900" style="background: linear-gradient(135deg, #f0f4f8 0%, #e8eef5 50%, #f0f4f8 100%)">
    <div v-if="showSidebar" class="fixed inset-0 bg-black/50 z-10 lg:hidden" @click="showSidebar = false"></div>
    <div :class="['fixed lg:relative z-20 h-full transition-transform duration-300', showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0']">
      <Sidebar @close="showSidebar = false" />
    </div>
    <div class="flex-1 flex flex-col min-w-0">
      <header class="flex items-center justify-between px-4 lg:px-6 py-3 light-header">
        <div class="flex items-center gap-3">
          <button @click="showSidebar = !showSidebar" class="lg:hidden text-xl">
            <i class="fas fa-bars"></i>
          </button>
          <h1 class="text-lg lg:text-xl font-semibold truncate">{{ pageTitle }}</h1>
        </div>
        <div class="flex items-center gap-2 lg:gap-4">
          <div class="text-xs lg:text-sm leading-tight px-3 py-1.5 rounded-lg border hidden sm:block bg-gradient-to-r from-blue-50 to-sky-50 border-blue-200 light-badge">
            <div class="flex items-center gap-2">
              <i class="fas fa-calendar-alt text-blue-500 text-[10px]"></i>
              <span class="font-medium">{{ clock.day }}, {{ clock.date }}</span>
            </div>
            <div class="flex items-center gap-2 mt-0.5">
              <i class="fas fa-clock text-blue-500 text-[10px]"></i>
              <span class="font-bold text-blue-600 text-sm lg:text-base tabular-nums">{{ clock.time }}</span>
              <span class="text-[10px] uppercase tracking-wider font-semibold text-gray-500">WIB</span>
            </div>
          </div>
          <div class="h-6 border-l border-blue-200"></div>
          <span class="text-sm lg:text-base hidden sm:inline">{{ authStore.user?.nama }}</span>
          <button @click="handleLogout" class="px-2 lg:px-3 py-1.5 rounded-lg text-white text-sm font-medium transition-all bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-sm hover:shadow-md">
            <i class="fas fa-sign-out-alt lg:mr-1"></i><span class="hidden lg:inline">Logout</span>
          </button>
        </div>
      </header>
      <main class="flex-1 p-6 overflow-auto">
        <router-view />
      </main>
      <Notification />
      <ConfirmDialog :show="showLogoutModal" title="Konfirmasi Logout" message="Yakin ingin logout dari sistem?" @confirm="confirmLogout" @cancel="showLogoutModal = false" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Sidebar from '../components/Sidebar.vue'
import Notification from '../components/Notification.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import axios from 'axios'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const showSidebar = ref(false)
const showLogoutModal = ref(false)
const clock = ref({ day: '', date: '', time: '' })
let clockInterval = null
let serverSeconds = 0

onMounted(async () => {
  await fetchServerTime()
  clockInterval = setInterval(() => {
    if (serverSeconds > 0) {
      serverSeconds++
      const h = String(Math.floor(serverSeconds / 3600) % 24).padStart(2, '0')
      const m = String(Math.floor(serverSeconds / 60) % 60).padStart(2, '0')
      const s = String(serverSeconds % 60).padStart(2, '0')
      clock.value.time = `${h}:${m}:${s}`
    }
  }, 1000)
})

onUnmounted(() => {
  if (clockInterval) clearInterval(clockInterval)
})

async function fetchServerTime() {
  try {
    const res = await axios.get('/api/server-time')
    clock.value = {
      day: res.data.day,
      date: res.data.date,
      time: res.data.time,
    }
    const [h, m, s] = res.data.time.split(':').map(Number)
    serverSeconds = h * 3600 + m * 60 + s
  } catch (e) {}
}

const pageTitle = computed(() => {
  const titles = {
    Dashboard: 'Dashboard',
    Users: 'Data Users',
    Sekolah: 'Data Sekolah',
    TempatPkl: 'Data Tempat PKL',
    Siswa: 'Data Siswa',
    SiswaBinaan: 'Data Siswa Binaan',
    Penempatan: 'Data Penempatan',
    Presensi: 'Data Presensi',
    RekapPresensi: 'Rekap Presensi',
    Jurnal: 'Data Jurnal',
    Laporan: 'Data Laporan',
    Penilaian: 'Data Penilaian',
    Izin: 'Pengajuan Izin / Sakit',
    Profile: 'Profile',
    About: 'About Us',
  }
  return titles[route.name] || 'SIMPKL'
})

function handleLogout() {
  showLogoutModal.value = true
}

async function confirmLogout() {
  showLogoutModal.value = false
  try { await axios.post('/api/logout') } catch (e) {}
  authStore.logout()
  router.push('/login')
}
</script>

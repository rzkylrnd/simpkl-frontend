<template>
  <div :class="['flex h-screen', darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900']">
    <div v-if="showSidebar" class="fixed inset-0 bg-black/50 z-10 lg:hidden" @click="showSidebar = false"></div>
    <div :class="['fixed lg:relative z-20 h-full transition-transform duration-300', showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0']">
      <Sidebar @close="showSidebar = false" />
    </div>
    <div class="flex-1 flex flex-col min-w-0">
      <header :class="['flex items-center justify-between px-4 lg:px-6 py-3 shadow', darkMode ? 'bg-gray-800' : 'bg-white']">
        <div class="flex items-center gap-3">
          <button @click="showSidebar = !showSidebar" class="lg:hidden text-xl">
            <i class="fas fa-bars"></i>
          </button>
          <h1 class="text-lg lg:text-xl font-semibold truncate">{{ pageTitle }}</h1>
        </div>
        <div class="flex items-center gap-2 lg:gap-4">
          <button @click="themeStore.toggle()" class="px-2 lg:px-3 py-1 rounded border text-sm"
            :class="darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-200'">
            <i :class="darkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
            <span class="hidden lg:inline ml-1">{{ darkMode ? 'Terang' : 'Gelap' }}</span>
          </button>
          <span class="text-sm lg:text-base hidden sm:inline">{{ authStore.user?.nama }}</span>
          <button @click="handleLogout" class="px-2 lg:px-3 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600">
            <i class="fas fa-sign-out-alt lg:mr-1"></i><span class="hidden lg:inline">Logout</span>
          </button>
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

const showSidebar = ref(false)

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

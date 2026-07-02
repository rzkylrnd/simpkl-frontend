<template>
  <aside :class="['w-64 bg-blue-700 text-white flex flex-col transition-colors duration-300', darkMode ? 'bg-gray-800' : 'bg-blue-700']">
    <div class="p-4 text-lg font-bold border-b border-white/20">SIMPKL</div>
    <nav class="flex-1 p-2 space-y-1">
      <router-link v-for="item in filteredMenu" :key="item.path" :to="item.path"
        class="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/10 transition-colors"
        :class="{ 'bg-white/20': $route.path === item.path }"
        @click="$emit('close')">
        <span class="w-5 text-center" v-html="item.icon"></span>
        <span>{{ item.label }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'

defineEmits(['close'])

const authStore = useAuthStore()
const themeStore = useThemeStore()
const darkMode = computed(() => themeStore.darkMode)

const allMenu = [
  { path: '/', label: 'Dashboard', icon: '<i class="fas fa-tachometer-alt"></i>', roles: ['admin', 'siswa', 'guru_pembimbing', 'pembimbing_industri'] },
  { path: '/users', label: 'Users', icon: '<i class="fas fa-users"></i>', roles: ['admin'] },
  { path: '/sekolah', label: 'Sekolah', icon: '<i class="fas fa-school"></i>', roles: ['admin'] },
  { path: '/tempat-pkl', label: 'Tempat PKL', icon: '<i class="fas fa-building"></i>', roles: ['admin'] },
  { path: '/siswa', label: 'Siswa', icon: '<i class="fas fa-user-graduate"></i>', roles: ['admin'] },
  { path: '/penempatan', label: 'Penempatan', icon: '<i class="fas fa-map-marker-alt"></i>', roles: ['admin'] },
  { path: '/presensi', label: 'Presensi', icon: '<i class="fas fa-clipboard-check"></i>', roles: ['admin', 'siswa', 'guru_pembimbing', 'pembimbing_industri'] },
  { path: '/jurnal', label: 'Jurnal', icon: '<i class="fas fa-book"></i>', roles: ['admin', 'siswa', 'guru_pembimbing', 'pembimbing_industri'] },
  { path: '/laporan', label: 'Laporan', icon: '<i class="fas fa-file-alt"></i>', roles: ['admin', 'siswa', 'guru_pembimbing', 'pembimbing_industri'] },
  { path: '/penilaian', label: 'Penilaian', icon: '<i class="fas fa-star"></i>', roles: ['admin', 'siswa', 'guru_pembimbing', 'pembimbing_industri'] },
  { path: '/profile', label: 'Profile', icon: '<i class="fas fa-user"></i>', roles: ['admin', 'siswa', 'guru_pembimbing', 'pembimbing_industri'] },
]

const filteredMenu = computed(() => {
  return allMenu.filter(item => item.roles.includes(authStore.user?.role))
})
</script>

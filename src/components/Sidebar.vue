<template>
  <aside :class="['w-64 flex flex-col transition-all duration-300', darkMode ? 'bg-gray-800' : 'bg-gradient-to-b from-blue-700 to-blue-900']">
    <div :class="['p-4 text-lg font-bold flex items-center gap-2', darkMode ? 'border-b border-gray-700' : 'border-b border-white/20']">
      <div :class="'w-8 h-8 rounded-lg flex items-center justify-center text-sm ' + (darkMode ? 'bg-blue-600' : 'bg-white/20')">
        <i class="fas fa-graduation-cap"></i>
      </div>
      <span>SIMPKL</span>
    </div>
    <nav class="flex-1 p-2 space-y-0.5 overflow-y-auto">
      <router-link v-for="item in filteredMenu" :key="item.path" :to="item.path"
        class="group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200"
        :class="[
          $route.path === item.path
            ? (darkMode ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white/20 text-white shadow-md')
            : (darkMode ? 'text-gray-300 hover:bg-gray-700 hover:translate-x-1 hover:shadow-md' : 'text-white/80 hover:bg-white/10 hover:translate-x-1 hover:shadow-lg')
        ]"
        @click="$emit('close')">
        <span class="w-5 text-center text-sm" :class="$route.path === item.path ? 'scale-110' : ''" v-html="item.icon"></span>
        <span class="text-sm font-medium">{{ item.label }}</span>
        <span v-if="$route.path === item.path" :class="'ml-auto w-1.5 h-1.5 rounded-full ' + (darkMode ? 'bg-blue-300' : 'bg-white')"></span>
      </router-link>
    </nav>
    <div :class="['p-4 text-sm', darkMode ? 'border-t border-gray-700' : 'border-t border-white/20']">
      <div class="flex items-center gap-2">
        <i class="fas fa-user-circle text-xl"></i>
        <div class="truncate">
          <p class="truncate font-medium">{{ authStore.user?.nama }}</p>
          <p class="text-xs opacity-75 truncate">{{ authStore.user?.role }}</p>
        </div>
      </div>
    </div>
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

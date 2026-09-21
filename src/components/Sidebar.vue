<template>
  <aside :class="['w-64 flex flex-col transition-all duration-300', darkMode ? 'bg-gray-800' : 'bg-gradient-to-b from-blue-600 via-blue-700 to-blue-900 shadow-xl']">
    <div :class="['p-4 text-lg font-bold flex items-center gap-2', darkMode ? 'border-b border-gray-700' : 'border-b border-white/20']">
      <div :class="'w-8 h-8 rounded-lg flex items-center justify-center text-sm ' + (darkMode ? 'bg-blue-600' : 'bg-white/20 backdrop-blur-sm')">
        <i class="fas fa-graduation-cap"></i>
      </div>
      <span>SIMPKL</span>
    </div>
    <nav class="flex-1 p-2 space-y-3 overflow-y-auto">
      <div v-for="group in filteredMenu" :key="group.title">
        <button v-if="authStore.isAdmin" @click="toggleGroup(group.title)" class="w-full flex items-center justify-between px-3 py-1 rounded-lg transition-colors hover:bg-white/10">
          <p :class="['text-[10px] font-bold uppercase tracking-wider', darkMode ? 'text-gray-500' : 'text-white/50']">{{ group.title }}</p>
          <i :class="['fas fa-chevron-down text-[8px] transition-transform duration-200', darkMode ? 'text-gray-500' : 'text-white/50', isExpanded(group.title) ? 'rotate-180' : '']"></i>
        </button>
        <p v-else :class="['px-3 text-[10px] font-bold uppercase tracking-wider mb-1', darkMode ? 'text-gray-500' : 'text-white/50']">{{ group.title }}</p>
        <div v-show="isExpanded(group.title)" class="space-y-0.5">
          <router-link v-for="item in group.items" :key="item.path" :to="item.path"
            class="group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200"
            :class="[
              $route.path === item.path
                ? (darkMode ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white/25 text-white shadow-md backdrop-blur-sm')
                : (darkMode ? 'text-gray-300 hover:bg-gray-700 hover:translate-x-1 hover:shadow-md' : 'text-white/80 hover:bg-white/15 hover:text-white hover:translate-x-1 hover:shadow-lg')
            ]"
            @click="$emit('close')">
            <span class="w-5 text-center text-sm" :class="$route.path === item.path ? 'scale-110' : ''" v-html="item.icon"></span>
            <span class="text-sm font-medium">{{ item.label }}</span>
            <span v-if="$route.path === item.path" :class="'ml-auto w-1.5 h-1.5 rounded-full ' + (darkMode ? 'bg-blue-300' : 'bg-white shadow-sm')"></span>
          </router-link>
        </div>
      </div>
    </nav>
    <div :class="['p-4 text-sm', darkMode ? 'border-t border-gray-700' : 'border-t border-white/20']">
      <div class="flex items-center gap-2">
        <div :class="['w-9 h-9 rounded-full flex items-center justify-center text-lg', darkMode ? 'text-gray-300' : 'bg-white/20 text-white backdrop-blur-sm']">
          <i class="fas fa-user-circle"></i>
        </div>
        <div class="truncate">
          <p class="truncate font-medium text-white">{{ authStore.user?.nama }}</p>
          <p class="text-xs text-white/60 truncate capitalize">{{ authStore.user?.role?.replace('_', ' ') }}</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'

defineEmits(['close'])

const authStore = useAuthStore()
const themeStore = useThemeStore()
const darkMode = computed(() => themeStore.darkMode)

const menuGroups = [
  {
    title: 'Menu',
    items: [
      { path: '/', label: 'Dashboard', icon: '<i class="fas fa-tachometer-alt"></i>', roles: ['admin', 'siswa', 'pembimbing_sekolah', 'pembimbing_industri'] },
    ],
  },
  {
    title: 'Master Data',
    items: [
      { path: '/users', label: 'Users', icon: '<i class="fas fa-users"></i>', roles: ['admin'] },
      { path: '/sekolah', label: 'Sekolah', icon: '<i class="fas fa-school"></i>', roles: ['admin'] },
      { path: '/tempat-pkl', label: 'Bidang', icon: '<i class="fas fa-building"></i>', roles: ['admin'] },
      { path: '/siswa', label: 'Siswa', icon: '<i class="fas fa-user-graduate"></i>', roles: ['admin'] },
      { path: '/penempatan', label: 'Penempatan', icon: '<i class="fas fa-map-marker-alt"></i>', roles: ['admin'] },
    ],
  },
  {
    title: 'Pembinaan',
    items: [
      { path: '/siswa-binaan', label: 'Siswa Binaan', icon: '<i class="fas fa-user-friends"></i>', roles: ['pembimbing_sekolah', 'pembimbing_industri'] },
      { path: '/presensi', label: 'Presensi', icon: '<i class="fas fa-clipboard-check"></i>', roles: ['admin', 'siswa', 'pembimbing_sekolah', 'pembimbing_industri'] },
      { path: '/rekap-presensi', label: 'Rekap Presensi', icon: '<i class="fas fa-table"></i>', roles: ['admin', 'siswa', 'pembimbing_sekolah', 'pembimbing_industri'] },
      { path: '/jurnal', label: 'Jurnal', icon: '<i class="fas fa-book"></i>', roles: ['admin', 'siswa', 'pembimbing_sekolah', 'pembimbing_industri'] },
      { path: '/laporan', label: 'Laporan', icon: '<i class="fas fa-file-alt"></i>', roles: ['admin', 'siswa', 'pembimbing_sekolah', 'pembimbing_industri'] },
      { path: '/penilaian', label: 'Penilaian', icon: '<i class="fas fa-star"></i>', roles: ['admin', 'siswa', 'pembimbing_sekolah', 'pembimbing_industri'] },
      { path: '/izin', label: 'Izin / Sakit', icon: '<i class="fas fa-file-medical"></i>', roles: ['admin', 'siswa', 'pembimbing_sekolah', 'pembimbing_industri'] },
    ],
  },
  {
    title: 'Pengaturan',
    items: [
      { path: '/jam-presensi', label: 'Atur Jam', icon: '<i class="fas fa-clock"></i>', roles: ['admin'] },
    ],
  },
  {
    title: 'Akun',
    items: [
      { path: '/profile', label: 'Profile', icon: '<i class="fas fa-user"></i>', roles: ['admin', 'siswa', 'pembimbing_sekolah', 'pembimbing_industri'] },
    ],
  },
]

const filteredMenu = computed(() => {
  const role = authStore.user?.role
  return menuGroups
    .map(group => ({
      ...group,
      items: group.items.filter(item => item.roles.includes(role)),
    }))
    .filter(group => group.items.length > 0)
})

const expanded = ref({})
function isExpanded(title) {
  return expanded.value[title] !== false
}
function toggleGroup(title) {
  expanded.value[title] = isExpanded(title) ? false : true
}
</script>

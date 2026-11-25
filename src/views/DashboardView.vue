<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-1">Dashboard</h2>
      <p :class="['text-sm', darkMode ? 'text-gray-400' : 'text-gray-500']">{{ roleLabel }} &mdash; {{ todayStr }}</p>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div v-for="card in cards" :key="card.label"
        :class="['p-5 rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-default', darkMode ? 'bg-gray-800 border-gray-700' : 'light-card']">
        <div class="flex items-center justify-between mb-3">
          <div :class="['w-10 h-10 rounded-xl flex items-center justify-center shadow-sm', card.bg]">
            <i :class="[card.icon, 'text-white']"></i>
          </div>
          <span v-if="card.badge" :class="['text-[10px] font-bold px-2 py-0.5 rounded-full', card.badgeBg]">{{ card.badge }}</span>
        </div>
        <p class="text-3xl font-bold tabular-nums">{{ stats[card.key] ?? 0 }}</p>
        <p :class="['text-sm mt-1', darkMode ? 'text-gray-400' : 'text-gray-500']">{{ card.label }}</p>
      </div>
    </div>

    <!-- Siswa: Status Hari Ini -->
    <div v-if="authStore.isSiswa" class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
      <!-- Status Presensi -->
      <div :class="['rounded-xl p-5 border', darkMode ? 'bg-gray-800 border-gray-700' : 'light-card']">
        <h3 class="text-sm font-semibold mb-3 flex items-center gap-2">
          <i class="fas fa-clipboard-check text-yellow-500"></i> Presensi Hari Ini
        </h3>
        <div v-if="todayPresensi">
          <div class="flex items-center gap-2 mb-2">
            <span :class="['px-2 py-0.5 rounded text-xs font-bold', todayPresensi.waktu_datang ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500']">
              {{ todayPresensi.waktu_datang ? 'Masuk ' + todayPresensi.waktu_datang.slice(0,5) : 'Belum Masuk' }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <span :class="['px-2 py-0.5 rounded text-xs font-bold', todayPresensi.waktu_pulang ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500']">
              {{ todayPresensi.waktu_pulang ? 'Pulang ' + todayPresensi.waktu_pulang.slice(0,5) : 'Belum Pulang' }}
            </span>
          </div>
        </div>
        <div v-else class="text-center py-4">
          <i class="fas fa-clock text-3xl text-gray-300 mb-2"></i>
          <p :class="['text-xs', darkMode ? 'text-gray-500' : 'text-gray-400']">Belum presensi hari ini</p>
        </div>
      </div>

      <!-- Status Jurnal -->
      <div :class="['rounded-xl p-5 border', darkMode ? 'bg-gray-800 border-gray-700' : 'light-card']">
        <h3 class="text-sm font-semibold mb-3 flex items-center gap-2">
          <i class="fas fa-book text-blue-500"></i> Jurnal Hari Ini
        </h3>
        <div v-if="todayJurnal">
          <span class="px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700">Sudah Diisi</span>
          <p :class="['text-xs mt-2 line-clamp-2', darkMode ? 'text-gray-400' : 'text-gray-500']">{{ todayJurnal.kegiatan }}</p>
        </div>
        <div v-else class="text-center py-4">
          <i class="fas fa-pen text-3xl text-gray-300 mb-2"></i>
          <p :class="['text-xs', darkMode ? 'text-gray-500' : 'text-gray-400']">Belum mengisi jurnal</p>
        </div>
      </div>

      <!-- Sisa Hari PKL -->
      <div :class="['rounded-xl p-5 border', darkMode ? 'bg-gray-800 border-gray-700' : 'light-card']">
        <h3 class="text-sm font-semibold mb-3 flex items-center gap-2">
          <i class="fas fa-calendar-alt text-purple-500"></i> Progress PKL
        </h3>
        <div v-if="penempatanSiswa">
          <div class="flex justify-between text-xs mb-1">
            <span>{{ penempatanSiswa.tanggal_mulai }}</span>
            <span>{{ penempatanSiswa.tanggal_selesai }}</span>
          </div>
          <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div class="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000" :style="{ width: pklProgress + '%' }"></div>
          </div>
          <p class="text-xs font-semibold text-center" :class="darkMode ? 'text-gray-300' : 'text-gray-600'">
            Hari ke-{{ pklDay }} dari {{ pklTotal }} hari ({{ pklProgress }}%)
          </p>
        </div>
        <div v-else class="text-center py-4">
          <i class="fas fa-info-circle text-3xl text-gray-300 mb-2"></i>
          <p :class="['text-xs', darkMode ? 'text-gray-500' : 'text-gray-400']">Belum ada penempatan</p>
        </div>
      </div>
    </div>

    <!-- Pembimbing: Menunggu Validasi -->
    <div v-if="authStore.isPembimbingIndustri || authStore.isPembimbingSekolah" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <div v-for="task in pendingTasks" :key="task.label"
        :class="['rounded-xl p-5 border transition-all duration-300 hover:shadow-md cursor-pointer', darkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'light-card hover:border-blue-200']"
        @click="go(task.route)">
        <div class="flex items-center justify-between mb-3">
          <div :class="['w-10 h-10 rounded-xl flex items-center justify-center', task.bg]">
            <i :class="[task.icon, 'text-white']"></i>
          </div>
          <span v-if="task.count > 0" class="text-lg font-bold text-red-500">{{ task.count }}</span>
          <span v-else class="text-xs text-green-500 font-semibold">Selesai</span>
        </div>
        <p class="text-sm font-semibold">{{ task.label }}</p>
        <p :class="['text-xs mt-1', darkMode ? 'text-gray-500' : 'text-gray-400']">{{ task.desc }}</p>
      </div>
    </div>

    <!-- Admin: Ringkasan Sekolah & Siswa -->
    <div v-if="authStore.isAdmin" class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Siswa per Sekolah -->
      <div :class="['rounded-xl p-5 border', darkMode ? 'bg-gray-800 border-gray-700' : 'light-card']">
        <h3 class="text-sm font-semibold mb-4 flex items-center gap-2">
          <i class="fas fa-school text-purple-500"></i> Siswa per Sekolah
        </h3>
        <div class="space-y-3">
          <div v-for="s in siswaPerSekolah" :key="s.nama">
            <div class="flex justify-between text-xs mb-1">
              <span class="font-medium">{{ s.nama }}</span>
              <span :class="darkMode ? 'text-gray-400' : 'text-gray-500'">{{ s.jumlah }} siswa</span>
            </div>
            <div class="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full bg-purple-500 rounded-full" :style="{ width: (s.jumlah / maxSekolah * 100) + '%' }"></div>
            </div>
          </div>
          <p v-if="!siswaPerSekolah.length" :class="['text-xs text-center py-2', darkMode ? 'text-gray-500' : 'text-gray-400']">Belum ada data</p>
        </div>
      </div>

      <!-- Status Validasi -->
      <div :class="['rounded-xl p-5 border', darkMode ? 'bg-gray-800 border-gray-700' : 'light-card']">
        <h3 class="text-sm font-semibold mb-4 flex items-center gap-2">
          <i class="fas fa-check-double text-green-500"></i> Status Validasi
        </h3>
        <div class="space-y-4">
          <div v-for="v in validasiStats" :key="v.label">
            <div class="flex justify-between text-xs mb-1">
              <span class="font-medium">{{ v.label }}</span>
              <span :class="darkMode ? 'text-gray-400' : 'text-gray-500'">{{ v.valid }}/{{ v.total }}</span>
            </div>
            <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all duration-1000" :class="v.color" :style="{ width: (v.total > 0 ? v.valid / v.total * 100 : 0) + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Siswa: Aktivitas Terakhir -->
    <div v-if="authStore.isSiswa" class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div :class="['rounded-xl p-5 border', darkMode ? 'bg-gray-800 border-gray-700' : 'light-card']">
        <h3 class="text-sm font-semibold mb-4 flex items-center gap-2">
          <i class="fas fa-history text-blue-500"></i> Presensi Terakhir
        </h3>
        <div v-if="recentPresensi.length" class="space-y-2">
          <div v-for="p in recentPresensi" :key="p.id_presensi" class="flex items-center justify-between py-2 border-b" :class="darkMode ? 'border-gray-700' : 'border-gray-100'">
            <div class="flex items-center gap-2">
              <span :class="['w-2 h-2 rounded-full', p.status_validasi === 'valid' ? 'bg-green-500' : p.status_validasi === 'tidak_valid' ? 'bg-red-500' : 'bg-yellow-500']"></span>
              <span class="text-xs font-medium">{{ p.tanggal }}</span>
            </div>
            <div class="flex items-center gap-3 text-xs">
              <span :class="darkMode ? 'text-gray-400' : 'text-gray-500'">{{ p.waktu_datang?.slice(0,5) || '-' }}</span>
              <span :class="darkMode ? 'text-gray-600' : 'text-gray-300'">/</span>
              <span :class="darkMode ? 'text-gray-400' : 'text-gray-500'">{{ p.waktu_pulang?.slice(0,5) || '-' }}</span>
            </div>
          </div>
        </div>
        <p v-else :class="['text-xs text-center py-4', darkMode ? 'text-gray-500' : 'text-gray-400']">Belum ada presensi</p>
      </div>

      <div :class="['rounded-xl p-5 border', darkMode ? 'bg-gray-800 border-gray-700' : 'light-card']">
        <h3 class="text-sm font-semibold mb-4 flex items-center gap-2">
          <i class="fas fa-book text-purple-500"></i> Jurnal Terakhir
        </h3>
        <div v-if="recentJurnal.length" class="space-y-2">
          <div v-for="j in recentJurnal" :key="j.id_jurnal" class="flex items-center justify-between py-2 border-b" :class="darkMode ? 'border-gray-700' : 'border-gray-100'">
            <div class="flex items-center gap-2">
              <span :class="['w-2 h-2 rounded-full', j.status_validasi === 'valid' ? 'bg-green-500' : j.status_validasi === 'tidak_valid' ? 'bg-red-500' : 'bg-yellow-500']"></span>
              <span class="text-xs font-medium">{{ j.tanggal }}</span>
            </div>
            <span :class="['text-xs truncate max-w-[120px]', darkMode ? 'text-gray-400' : 'text-gray-500']">{{ j.kegiatan }}</span>
          </div>
        </div>
        <p v-else :class="['text-xs text-center py-4', darkMode ? 'text-gray-500' : 'text-gray-400']">Belum ada jurnal</p>
      </div>
    </div>

    <!-- Quick Actions -->
    <div>
      <h3 class="text-lg font-semibold mb-3">Aksi Cepat</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        <button v-for="act in quickActions" :key="act.label" @click="go(act.route)"
          :class="['flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5', darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'light-card hover:bg-blue-50/50']">
          <div :class="['w-9 h-9 rounded-xl flex items-center justify-center text-sm shadow-sm', act.bg]">
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
import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()
const darkMode = false

const stats = ref({})
const todayPresensi = ref(null)
const todayJurnal = ref(null)
const penempatanSiswa = ref(null)
const recentPresensi = ref([])
const recentJurnal = ref([])
const siswaPerSekolah = ref([])
const validasiStats = ref([])
const pendingStats = ref({ presensi: 0, jurnal: 0, izin: 0, laporan: 0 })

const today = new Date().toISOString().slice(0, 10)
const todayStr = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

const roleLabel = computed(() => ({
  admin: 'Administrator',
  siswa: 'Peserta PKL',
  pembimbing_sekolah: 'Pembimbing Sekolah',
  pembimbing_industri: 'Pembimbing Industri',
}[authStore.user?.role] || ''))

const cards = computed(() => {
  const role = authStore.user?.role
  if (role === 'siswa') return [
    { key: 'presensiHari', label: 'Presensi Hari Ini', icon: 'fas fa-clipboard-check', bg: 'bg-yellow-500', badge: todayPresensi.value ? '✓' : '!', badgeBg: todayPresensi.value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700' },
    { key: 'jurnalHari', label: 'Jurnal Hari Ini', icon: 'fas fa-book', bg: 'bg-blue-500', badge: todayJurnal.value ? '✓' : '!', badgeBg: todayJurnal.value ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500' },
    { key: 'totalPresensi', label: 'Total Presensi', icon: 'fas fa-calendar-check', bg: 'bg-green-500' },
    { key: 'totalJurnal', label: 'Total Jurnal', icon: 'fas fa-book-open', bg: 'bg-purple-500' },
  ]
  if (role === 'admin') return [
    { key: 'siswa', label: 'Total Siswa', icon: 'fas fa-user-graduate', bg: 'bg-blue-500' },
    { key: 'penempatan', label: 'Total Penempatan', icon: 'fas fa-map-marker-alt', bg: 'bg-green-500' },
    { key: 'presensi', label: 'Presensi Hari Ini', icon: 'fas fa-clipboard-check', bg: 'bg-yellow-500' },
    { key: 'laporan', label: 'Total Laporan', icon: 'fas fa-file-alt', bg: 'bg-purple-500' },
  ]
  return [
    { key: 'siswaBinaan', label: 'Siswa Binaan', icon: 'fas fa-user-friends', bg: 'bg-blue-500' },
    { key: 'totalPresensi', label: 'Total Presensi', icon: 'fas fa-clipboard-check', bg: 'bg-yellow-500' },
    { key: 'totalJurnal', label: 'Total Jurnal', icon: 'fas fa-book', bg: 'bg-green-500' },
  ]
})

const pendingTasks = computed(() => {
  const role = authStore.user?.role
  if (role === 'pembimbing_industri') return [
    { label: 'Presensi', desc: 'Menunggu validasi presensi siswa', icon: 'fas fa-clipboard-check', bg: 'bg-yellow-500', count: pendingStats.value.presensi, route: 'Presensi' },
    { label: 'Jurnal', desc: 'Menunggu validasi jurnal siswa', icon: 'fas fa-book', bg: 'bg-blue-500', count: pendingStats.value.jurnal, route: 'Jurnal' },
    { label: 'Izin / Sakit', desc: 'Menunggu persetujuan izin', icon: 'fas fa-file-medical', bg: 'bg-red-500', count: pendingStats.value.izin, route: 'Izin' },
  ]
  return [
    { label: 'Laporan Akhir', desc: 'Menunggu validasi laporan', icon: 'fas fa-file-alt', bg: 'bg-purple-500', count: pendingStats.value.laporan, route: 'Laporan' },
    { label: 'Izin / Sakit', desc: 'Menunggu persetujuan izin', icon: 'fas fa-file-medical', bg: 'bg-red-500', count: pendingStats.value.izin, route: 'Izin' },
    { label: 'Monitoring Presensi', desc: 'Lihat presensi siswa binaan', icon: 'fas fa-clipboard-check', bg: 'bg-yellow-500', count: 0, route: 'Presensi' },
  ]
})

const maxSekolah = computed(() => Math.max(...siswaPerSekolah.value.map(s => s.jumlah), 1))

const pklProgress = computed(() => {
  if (!penempatanSiswa.value) return 0
  const mulai = new Date(penempatanSiswa.value.tanggal_mulai)
  const selesai = new Date(penempatanSiswa.value.tanggal_selesai)
  const now = new Date()
  const total = (selesai - mulai) / 86400000
  const elapsed = (now - mulai) / 86400000
  return Math.min(100, Math.max(0, Math.round(elapsed / total * 100)))
})

const pklDay = computed(() => {
  if (!penempatanSiswa.value) return 0
  const mulai = new Date(penempatanSiswa.value.tanggal_mulai)
  const now = new Date()
  return Math.max(1, Math.ceil((now - mulai) / 86400000))
})

const pklTotal = computed(() => {
  if (!penempatanSiswa.value) return 0
  const mulai = new Date(penempatanSiswa.value.tanggal_mulai)
  const selesai = new Date(penempatanSiswa.value.tanggal_selesai)
  return Math.ceil((selesai - mulai) / 86400000)
})

const quickActions = computed(() => {
  const role = authStore.user?.role
  if (role === 'siswa') return [
    { label: 'Isi Presensi', icon: 'fas fa-clipboard-check', route: 'Presensi', bg: 'bg-yellow-500' },
    { label: 'Isi Jurnal', icon: 'fas fa-book', route: 'Jurnal', bg: 'bg-blue-500' },
    { label: 'Upload Laporan', icon: 'fas fa-file-upload', route: 'Laporan', bg: 'bg-purple-500' },
    { label: 'Lihat Penilaian', icon: 'fas fa-star', route: 'Penilaian', bg: 'bg-green-500' },
    { label: 'Profile Saya', icon: 'fas fa-user', route: 'Profile', bg: 'bg-gray-500' },
  ]
  if (role === 'pembimbing_sekolah') return [
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
    const role = authStore.user?.role

    if (role === 'siswa') {
      const [presensiRes, jurnalRes, penempatanRes] = await Promise.all([
        axios.get('/api/presensi'),
        axios.get('/api/jurnal'),
        axios.get('/api/penempatan'),
      ])
      const allPresensi = presensiRes.data.data || []
      const allJurnal = jurnalRes.data.data || []
      todayPresensi.value = allPresensi.find(p => p.tanggal === today) || null
      todayJurnal.value = allJurnal.find(j => j.tanggal === today) || null
      stats.value = { presensiHari: todayPresensi.value ? '✓' : '—', jurnalHari: todayJurnal.value ? '✓' : '—', totalPresensi: allPresensi.length, totalJurnal: allJurnal.length }
      recentPresensi.value = allPresensi.slice(0, 5)
      recentJurnal.value = allJurnal.slice(0, 5)
      const penempatan = penempatanRes.data.data || []
      penempatanSiswa.value = penempatan[0] || null
    } else if (role === 'admin') {
      const [siswa, penempatan, presensi, laporan, sekolah, users] = await Promise.all([
        axios.get('/api/siswa'),
        axios.get('/api/penempatan'),
        axios.get('/api/presensi'),
        axios.get('/api/laporan'),
        axios.get('/api/sekolah'),
        axios.get('/api/users'),
      ])
      const siswaData = siswa.data.data || []
      stats.value = {
        siswa: siswaData.length,
        penempatan: (penempatan.data.data || []).length,
        presensi: (presensi.data.data || []).filter(p => p.tanggal === today).length,
        laporan: (laporan.data.data || []).length,
      }
      // Siswa per sekolah
      const sekolahData = sekolah.data.data || []
      siswaPerSekolah.value = sekolahData.map(s => ({
        nama: s.nama_sekolah,
        jumlah: siswaData.filter(si => si.id_sekolah === s.id_sekolah).length,
      })).filter(s => s.jumlah > 0).sort((a, b) => b.jumlah - a.jumlah).slice(0, 5)
      // Validasi stats
      const allPresensi = presensi.data.data || []
      const allJurnal = (await axios.get('/api/jurnal')).data.data || []
      const allLaporan = laporan.data.data || []
      validasiStats.value = [
        { label: 'Presensi', valid: allPresensi.filter(p => p.status_validasi === 'valid').length, total: allPresensi.length, color: 'bg-green-500' },
        { label: 'Jurnal', valid: allJurnal.filter(j => j.status_validasi === 'valid').length, total: allJurnal.length, color: 'bg-blue-500' },
        { label: 'Laporan', valid: allLaporan.filter(l => l.status_validasi === 'valid').length, total: allLaporan.length, color: 'bg-purple-500' },
      ]
    } else {
      // Pembimbing
      const [siswaBinaanRes, presensiRes, jurnalRes, izinRes, laporanRes] = await Promise.all([
        axios.get('/api/siswa-binaan-list'),
        axios.get('/api/presensi'),
        axios.get('/api/jurnal'),
        axios.get('/api/izin'),
        axios.get('/api/laporan'),
      ])
      const binaan = siswaBinaanRes.data.data || []
      const allPresensi = presensiRes.data.data || []
      const allJurnal = jurnalRes.data.data || []
      const allIzin = izinRes.data.data || []
      const allLaporan = laporanRes.data.data || []
      stats.value = { siswaBinaan: binaan.length, totalPresensi: allPresensi.length, totalJurnal: allJurnal.length }
      pendingStats.value = {
        presensi: allPresensi.filter(p => p.status_validasi === 'menunggu').length,
        jurnal: allJurnal.filter(j => j.status_validasi === 'menunggu').length,
        izin: allIzin.filter(i => i.status_validasi === 'menunggu').length,
        laporan: allLaporan.filter(l => l.status_validasi === 'menunggu').length,
      }
    }
  } catch (e) {}
})
</script>
<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Selamat Datang, {{ authStore.user?.nama }}</h2>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white p-4 rounded shadow">
        <p class="text-gray-500 text-sm">Total Siswa</p>
        <p class="text-2xl font-bold">{{ stats.siswa }}</p>
      </div>
      <div class="bg-white p-4 rounded shadow">
        <p class="text-gray-500 text-sm">Total Penempatan</p>
        <p class="text-2xl font-bold">{{ stats.penempatan }}</p>
      </div>
      <div class="bg-white p-4 rounded shadow">
        <p class="text-gray-500 text-sm">Presensi Hari Ini</p>
        <p class="text-2xl font-bold">{{ stats.presensi }}</p>
      </div>
      <div class="bg-white p-4 rounded shadow">
        <p class="text-gray-500 text-sm">Total Laporan</p>
        <p class="text-2xl font-bold">{{ stats.laporan }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'

const authStore = useAuthStore()
const stats = ref({ siswa: 0, penempatan: 0, presensi: 0, laporan: 0 })

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

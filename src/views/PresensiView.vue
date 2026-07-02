<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Data Presensi</h3>
      <button v-if="authStore.isSiswa" @click="showForm = true" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Tambah</button>
    </div>
    <div :class="['rounded shadow overflow-x-auto', darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white']">
      <table class="w-full text-sm">
        <thead :class="darkMode ? 'bg-gray-700' : 'bg-gray-50'">
          <tr>
            <th class="p-2 text-left">Siswa</th>
            <th class="p-2 text-left">Tanggal</th>
            <th class="p-2 text-left">Datang</th>
            <th class="p-2 text-left">Pulang</th>
            <th class="p-2 text-left">Status</th>
            <th class="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in data" :key="item.id_presensi" :class="[i % 2 === 0 ? 'bg-white' : 'bg-gray-50', 'hover:bg-blue-50 transition-colors']">
            <td class="p-3">{{ item.siswa?.user?.nama }}</td>
            <td class="p-3">{{ item.tanggal }}</td>
            <td class="p-3">{{ item.waktu_datang || '-' }}</td>
            <td class="p-3">{{ item.waktu_pulang || '-' }}</td>
            <td class="p-3">
              <span v-if="item.status_validasi === 'valid'" class="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Valid</span>
              <span v-else-if="item.status_validasi === 'tidak_valid'" class="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">Tidak Valid</span>
              <span v-else class="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">Menunggu</span>
            </td>
            <td class="p-3 text-center whitespace-nowrap">
              <template v-if="authStore.isPembimbingIndustri && item.status_validasi === 'menunggu'">
                <button @click="validasi(item.id_presensi, 'valid')" class="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 mr-1">Valid</button>
                <button @click="validasi(item.id_presensi, 'tidak_valid')" class="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600">Tidak Valid</button>
              </template>
              <template v-else>
                <button @click="edit(item)" class="text-blue-600 hover:underline mr-2">Edit</button>
                <button @click="hapus(item.id_presensi)" class="text-red-600 hover:underline">Hapus</button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div :class="['p-6 rounded shadow-lg w-full max-w-md', darkMode ? 'bg-gray-800' : 'bg-white']">
        <h3 class="text-lg font-bold mb-4">{{ form.id ? 'Edit' : 'Tambah' }} Presensi</h3>
        <form @submit.prevent="simpan">
          <div class="mb-3">
            <label class="block text-sm mb-1">Siswa</label>
            <select v-if="!form.id" v-model="form.id_siswa" required class="w-full border px-3 py-2 rounded">
              <option value="">-- Pilih --</option>
              <option v-for="s in siswa" :key="s.id_siswa" :value="s.id_siswa">{{ s.user?.nama }}</option>
            </select>
            <input v-else :value="selectedSiswaNama" disabled class="w-full border px-3 py-2 rounded bg-gray-100" />
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Tanggal</label>
            <input v-model="form.tanggal" type="date" required class="w-full border px-3 py-2 rounded" />
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Waktu Datang</label>
            <input v-model="form.waktu_datang" type="time" class="w-full border px-3 py-2 rounded" />
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Waktu Pulang</label>
            <input v-model="form.waktu_pulang" type="time" class="w-full border px-3 py-2 rounded" />
          </div>
          <div class="mb-4">
            <label class="block text-sm mb-1">Catatan</label>
            <textarea v-model="form.catatan" class="w-full border px-3 py-2 rounded"></textarea>
          </div>
          <div class="flex gap-2 justify-end">
            <button type="button" @click="batal" class="px-4 py-2 border rounded hover:bg-gray-100">Batal</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'

const authStore = useAuthStore()
const data = ref([])
const siswa = ref([])
const showForm = ref(false)
const form = ref({ id: null, id_siswa: '', tanggal: '', waktu_datang: '', waktu_pulang: '', catatan: '' })

const selectedSiswaNama = computed(() => {
  const s = siswa.value.find(x => x.id_siswa == form.value.id_siswa)
  return s?.user?.nama || ''
})

onMounted(() => { load(); if (authStore.isAdmin || authStore.isSiswa) loadSiswa() })

async function load() {
  const res = await axios.get('/api/presensi')
  data.value = res.data.data
}

async function loadSiswa() {
  try {
    const res = await axios.get('/api/siswa')
    siswa.value = res.data.data
  } catch (e) {}
}

function edit(item) {
  form.value = { id: item.id_presensi, id_siswa: item.id_siswa, tanggal: item.tanggal, waktu_datang: item.waktu_datang || '', waktu_pulang: item.waktu_pulang || '', catatan: item.catatan || '' }
  showForm.value = true
}

function batal() {
  showForm.value = false
  form.value = { id: null, id_siswa: '', tanggal: '', waktu_datang: '', waktu_pulang: '', catatan: '' }
}

async function simpan() {
  const payload = { ...form.value }
  if (!payload.waktu_datang) delete payload.waktu_datang
  if (!payload.waktu_pulang) delete payload.waktu_pulang
  if (!payload.catatan) delete payload.catatan
  if (form.value.id) {
    await axios.put(`/api/presensi/${form.value.id}`, payload)
  } else {
    await axios.post('/api/presensi', payload)
  }
  batal()
  load()
}

async function validasi(id, status) {
  await axios.put(`/api/presensi/${id}/validasi`, { status_validasi: status })
  load()
}

async function hapus(id) {
  if (confirm('Yakin hapus?')) {
    await axios.delete(`/api/presensi/${id}`)
    load()
  }
}
</script>





<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Data Jurnal Harian</h3>
      <button v-if="authStore.isSiswa" @click="showForm = true" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Tambah</button>
    </div>
    <div class="bg-white rounded shadow overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="p-2 text-left">Siswa</th>
            <th class="p-2 text-left">Tanggal</th>
            <th class="p-2 text-left">Kegiatan</th>
            <th class="p-2 text-left">Hasil</th>
            <th class="p-2 text-left">Kendala</th>
            <th class="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data" :key="item.id_jurnal" class="hover:bg-blue-50 transition-colors">
            <td class="p-3">{{ item.siswa?.user?.nama }}</td>
            <td class="p-3">{{ item.tanggal }}</td>
            <td class="p-2 max-w-[200px] truncate">{{ item.kegiatan }}</td>
            <td class="p-2 max-w-[150px] truncate">{{ item.hasil || '-' }}</td>
            <td class="p-2 max-w-[150px] truncate">{{ item.kendala || '-' }}</td>
            <td class="p-3 text-center whitespace-nowrap">
              <button @click="edit(item)" class="text-blue-600 hover:underline mr-2">Edit</button>
              <button @click="hapus(item.id_jurnal)" class="text-red-600 hover:underline">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div class="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h3 class="text-lg font-bold mb-4">{{ form.id ? 'Edit' : 'Tambah' }} Jurnal</h3>
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
            <label class="block text-sm mb-1">Kegiatan</label>
            <textarea v-model="form.kegiatan" required class="w-full border px-3 py-2 rounded"></textarea>
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Hasil</label>
            <textarea v-model="form.hasil" class="w-full border px-3 py-2 rounded"></textarea>
          </div>
          <div class="mb-4">
            <label class="block text-sm mb-1">Kendala</label>
            <textarea v-model="form.kendala" class="w-full border px-3 py-2 rounded"></textarea>
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
const form = ref({ id: null, id_siswa: '', tanggal: '', kegiatan: '', hasil: '', kendala: '' })

const selectedSiswaNama = computed(() => {
  const s = siswa.value.find(x => x.id_siswa == form.value.id_siswa)
  return s?.user?.nama || ''
})

onMounted(() => { load(); if (authStore.isAdmin || authStore.isSiswa) loadSiswa() })

async function load() {
  const res = await axios.get('/api/jurnal')
  data.value = res.data.data
}

async function loadSiswa() {
  try {
    const res = await axios.get('/api/siswa')
    siswa.value = res.data.data
  } catch (e) {}
}

function edit(item) {
  form.value = { id: item.id_jurnal, id_siswa: item.id_siswa, tanggal: item.tanggal, kegiatan: item.kegiatan, hasil: item.hasil || '', kendala: item.kendala || '' }
  showForm.value = true
}

function batal() {
  showForm.value = false
  form.value = { id: null, id_siswa: '', tanggal: '', kegiatan: '', hasil: '', kendala: '' }
}

async function simpan() {
  const payload = { ...form.value }
  if (!payload.hasil) delete payload.hasil
  if (!payload.kendala) delete payload.kendala
  if (form.value.id) {
    await axios.put(`/api/jurnal/${form.value.id}`, payload)
  } else {
    await axios.post('/api/jurnal', payload)
  }
  batal()
  load()
}

async function hapus(id) {
  if (confirm('Yakin hapus?')) {
    await axios.delete(`/api/jurnal/${id}`)
    load()
  }
}
</script>


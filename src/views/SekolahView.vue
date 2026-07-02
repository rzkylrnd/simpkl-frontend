<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Data Sekolah</h3>
      <button @click="showForm = true" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Tambah</button>
    </div>
    <div class="bg-white rounded shadow overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="p-2 text-left">Nama Sekolah</th>
            <th class="p-2 text-left">Alamat</th>
            <th class="p-2 text-left">Telp</th>
            <th class="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in data" :key="item.id_sekolah" :class="[i % 2 === 0 ? 'bg-white' : 'bg-gray-50', 'hover:bg-blue-50 transition-colors']">
            <td class="p-3">{{ item.nama_sekolah }}</td>
            <td class="p-3">{{ item.alamat }}</td>
            <td class="p-3">{{ item.telp }}</td>
            <td class="p-3 text-center whitespace-nowrap">
              <button @click="edit(item)" class="text-blue-600 hover:underline mr-2">Edit</button>
              <button @click="hapus(item.id_sekolah)" class="text-red-600 hover:underline">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div class="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h3 class="text-lg font-bold mb-4">{{ form.id ? 'Edit' : 'Tambah' }} Sekolah</h3>
        <form @submit.prevent="simpan">
          <div class="mb-3">
            <label class="block text-sm mb-1">Nama Sekolah</label>
            <input v-model="form.nama_sekolah" type="text" required class="w-full border px-3 py-2 rounded" />
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Alamat</label>
            <input v-model="form.alamat" type="text" required class="w-full border px-3 py-2 rounded" />
          </div>
          <div class="mb-4">
            <label class="block text-sm mb-1">Telp</label>
            <input v-model="form.telp" type="text" class="w-full border px-3 py-2 rounded" />
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
import { ref, onMounted } from 'vue'
import axios from 'axios'

const data = ref([])
const showForm = ref(false)
const form = ref({ id: null, nama_sekolah: '', alamat: '', telp: '' })

onMounted(() => load())

async function load() {
  const res = await axios.get('/api/sekolah')
  data.value = res.data.data
}

function edit(item) {
  form.value = { id: item.id_sekolah, nama_sekolah: item.nama_sekolah, alamat: item.alamat, telp: item.telp }
  showForm.value = true
}

function batal() {
  showForm.value = false
  form.value = { id: null, nama_sekolah: '', alamat: '', telp: '' }
}

async function simpan() {
  if (form.value.id) {
    await axios.put(`/api/sekolah/${form.value.id}`, form.value)
  } else {
    await axios.post('/api/sekolah', form.value)
  }
  batal()
  load()
}

async function hapus(id) {
  if (confirm('Yakin hapus?')) {
    await axios.delete(`/api/sekolah/${id}`)
    load()
  }
}
</script>


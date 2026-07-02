<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Data Users</h3>
      <button @click="showForm = true" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Tambah</button>
    </div>
    <div class="bg-white rounded shadow overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="p-2 text-left">Nama</th>
            <th class="p-2 text-left">Email</th>
            <th class="p-2 text-left">Role</th>
            <th class="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data" :key="item.id" class="border-t">
            <td class="p-2">{{ item.nama }}</td>
            <td class="p-2">{{ item.email }}</td>
            <td class="p-2">{{ item.role }}</td>
            <td class="p-2 text-center">
              <button @click="edit(item)" class="text-blue-600 hover:underline mr-2">Edit</button>
              <button @click="hapus(item.id)" class="text-red-600 hover:underline">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div class="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h3 class="text-lg font-bold mb-4">{{ form.id ? 'Edit' : 'Tambah' }} User</h3>
        <form @submit.prevent="simpan">
          <div class="mb-3">
            <label class="block text-sm mb-1">Nama</label>
            <input v-model="form.nama" type="text" required class="w-full border px-3 py-2 rounded" />
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Email</label>
            <input v-model="form.email" type="text" required class="w-full border px-3 py-2 rounded" />
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Password <span class="text-gray-400">(isi jika ganti)</span></label>
            <input v-model="form.password" type="password" class="w-full border px-3 py-2 rounded" />
          </div>
          <div class="mb-4">
            <label class="block text-sm mb-1">Role</label>
            <select v-model="form.role" required class="w-full border px-3 py-2 rounded">
              <option value="admin">Admin</option>
              <option value="siswa">Siswa</option>
              <option value="guru_pembimbing">Guru Pembimbing</option>
              <option value="pembimbing_industri">Pembimbing Industri</option>
            </select>
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
const form = ref({ id: null, nama: '', email: '', password: '', role: 'siswa' })

onMounted(() => load())

async function load() {
  const res = await axios.get('/api/users')
  data.value = res.data.data
}

function edit(item) {
  form.value = { id: item.id, nama: item.nama, email: item.email, password: '', role: item.role }
  showForm.value = true
}

function batal() {
  showForm.value = false
  form.value = { id: null, nama: '', email: '', password: '', role: 'siswa' }
}

async function simpan() {
  if (form.value.id) {
    await axios.put(`/api/users/${form.value.id}`, form.value)
  } else {
    await axios.post('/api/users', form.value)
  }
  batal()
  load()
}

async function hapus(id) {
  if (confirm('Yakin hapus?')) {
    await axios.delete(`/api/users/${id}`)
    load()
  }
}
</script>

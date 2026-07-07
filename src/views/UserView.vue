<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Data Users</h3>
      <button @click="batal(); showForm = true" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Tambah</button>
    </div>
    <div :class="['rounded shadow overflow-x-auto', darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white']">
      <table class="w-full text-sm">
        <thead :class="darkMode ? 'bg-gray-700' : 'bg-gray-50'">
          <tr>
            <th class="p-2 text-left">Nama</th>
            <th class="p-2 text-left">Email</th>
            <th class="p-2 text-left">Role</th>
            <th class="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in data" :key="item.id" :class="[i % 2 === 0 ? (darkMode ? 'bg-gray-800' : 'bg-white') : (darkMode ? 'bg-gray-700' : 'bg-gray-50'), darkMode ? 'hover:bg-gray-600 transition-colors' : 'hover:bg-blue-50 transition-colors']">
            <td class="p-3">{{ item.nama }}</td>
            <td class="p-3">{{ item.email }}</td>
            <td class="p-3">
              <span :class="['px-2 py-0.5 rounded text-xs font-medium',
                item.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                item.role === 'guru_pembimbing' ? 'bg-blue-100 text-blue-700' :
                item.role === 'pembimbing_industri' ? 'bg-green-100 text-green-700' :
                'bg-yellow-100 text-yellow-700']">{{ item.role }}</span>
            </td>
            <td class="p-3 text-center whitespace-nowrap">
              <button @click="edit(item)" class="text-blue-600 hover:text-blue-800 mr-2" title="Edit"><i class="fas fa-edit"></i></button>
              <button @click="hapus(item.id)" class="text-red-600 hover:text-red-800" title="Hapus"><i class="fas fa-trash-alt"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-30">
      <div :class="['p-6 rounded shadow-lg w-full max-w-md', darkMode ? 'bg-gray-800' : 'bg-white']">
        <h3 class="text-lg font-bold mb-4">{{ form.id ? 'Edit' : 'Tambah' }} User</h3>
        <form @submit.prevent="simpan">
          <div class="mb-3">
            <label class="block text-sm mb-1">Nama</label>
            <input v-model="form.nama" type="text" required :class="['w-full border px-3 py-2 rounded', darkMode ? 'bg-gray-700 border-gray-600 text-white' : '']" />
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Email</label>
            <input v-model="form.email" type="text" required :class="['w-full border px-3 py-2 rounded', darkMode ? 'bg-gray-700 border-gray-600 text-white' : '']" />
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Password <span :class="darkMode ? 'text-gray-500' : 'text-gray-400'">(isi jika ganti)</span></label>
            <input v-model="form.password" type="password" :class="['w-full border px-3 py-2 rounded', darkMode ? 'bg-gray-700 border-gray-600 text-white' : '']" />
          </div>
          <div class="mb-4">
            <label class="block text-sm mb-1">Role</label>
            <select v-model="form.role" required :class="['w-full border px-3 py-2 rounded', darkMode ? 'bg-gray-700 border-gray-600 text-white' : '']">
              <option value="admin">Admin</option>
              <option value="siswa">Siswa</option>
              <option value="guru_pembimbing">Guru Pembimbing</option>
              <option value="pembimbing_industri">Pembimbing Industri</option>
            </select>
          </div>
          <div class="flex gap-2 justify-end">
            <button type="button" @click="batal" :class="['px-4 py-2 border rounded', darkMode ? 'border-gray-600 hover:bg-gray-700' : 'hover:bg-gray-100']">Batal</button>
            <button type="submit" :disabled="loading" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"><i v-if="loading" class="fas fa-spinner fa-spin mr-1"></i>{{ loading ? "Menyimpan..." : "Simpan" }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useThemeStore } from '../stores/theme'
import { useNotificationStore } from '../stores/notification'
import axios from 'axios'

const themeStore = useThemeStore()
const notif = useNotificationStore()
const darkMode = computed(() => themeStore.darkMode)

const loading = ref(false)
const data = ref([])
const showForm = ref(false)
const form = ref({ id: null, nama: '', email: '', password: '', role: 'siswa' })

onMounted(() => load())

async function load() {
  try {
    const res = await axios.get('/api/users')
    data.value = res.data.data
  } catch (e) {
    notif.showMessage('Gagal memuat data', 'error')
  }
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
  if (loading.value) return
  loading.value = true
  try {
    const payload = { ...form.value }
    if (!payload.password) delete payload.password
    if (form.value.id) {
      await axios.put(`/api/users/${form.value.id}`, payload)
    } else {
      await axios.post('/api/users', payload)
    }
    batal()
    load()
    notif.showMessage('User berhasil disimpan')
  } catch (e) {
    notif.showMessage(e.response?.data?.message || 'Gagal menyimpan', 'error')
  } finally {
    loading.value = false
  }
}

async function hapus(id) {
  if (!confirm('Yakin hapus?')) return
  try {
    await axios.delete(`/api/users/${id}`)
    load()
    notif.showMessage('User berhasil dihapus')
  } catch (e) {
    notif.showMessage('Gagal menghapus', 'error')
  }
}
</script>


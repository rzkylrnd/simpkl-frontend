<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Data Siswa</h3>
      <button @click="batal(); showForm = true" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Tambah</button>
    </div>
    <div :class="['rounded shadow overflow-x-auto', darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white']">
      <table class="w-full text-sm">
        <thead :class="darkMode ? 'bg-gray-700' : 'bg-gray-50'">
          <tr>
            <th class="p-2 text-left">Nama</th>
            <th class="p-2 text-left">NIS</th>
            <th class="p-2 text-left">Sekolah</th>
            <th class="p-2 text-left">Kelas</th>
            <th class="p-2 text-left">Jurusan</th>
            <th class="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in data" :key="item.id_siswa" :class="[i % 2 === 0 ? (darkMode ? 'bg-gray-800' : 'bg-white') : (darkMode ? 'bg-gray-700' : 'bg-gray-50'), darkMode ? 'hover:bg-gray-600 transition-colors' : 'hover:bg-blue-50 transition-colors']">
            <td class="p-3">{{ item.user?.nama }}</td>
            <td class="p-3">{{ item.nis }}</td>
            <td class="p-3">{{ item.sekolah?.nama_sekolah }}</td>
            <td class="p-3">{{ item.kelas }}</td>
            <td class="p-3">{{ item.jurusan }}</td>
            <td class="p-3 text-center whitespace-nowrap">
              <button @click="edit(item)" class="text-blue-600 hover:underline mr-2">Edit</button>
              <button @click="hapus(item.id_siswa)" class="text-red-600 hover:underline">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div :class="['p-6 rounded shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto', darkMode ? 'bg-gray-800' : 'bg-white']">
        <h3 class="text-lg font-bold mb-4">{{ form.id ? 'Edit' : 'Tambah' }} Siswa</h3>
        <form @submit.prevent="simpan">
          <div class="mb-3">
            <label class="block text-sm mb-1">User</label>
            <select v-model="form.id_user" required :class="['w-full border px-3 py-2 rounded', darkMode ? 'bg-gray-700 border-gray-600 text-white' : '']">
              <option value="">-- Pilih --</option>
              <option v-for="u in users" :key="u.id" :value="u.id">{{ u.nama }} ({{ u.email }})</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Sekolah</label>
            <select v-model="form.id_sekolah" required :class="['w-full border px-3 py-2 rounded', darkMode ? 'bg-gray-700 border-gray-600 text-white' : '']">
              <option value="">-- Pilih --</option>
              <option v-for="s in sekolah" :key="s.id_sekolah" :value="s.id_sekolah">{{ s.nama_sekolah }}</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">NIS</label>
            <input v-model="form.nis" type="text" required :class="['w-full border px-3 py-2 rounded', darkMode ? 'bg-gray-700 border-gray-600 text-white' : '']" />
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Kelas</label>
            <input v-model="form.kelas" type="text" required :class="['w-full border px-3 py-2 rounded', darkMode ? 'bg-gray-700 border-gray-600 text-white' : '']" />
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Jurusan</label>
            <input v-model="form.jurusan" type="text" required :class="['w-full border px-3 py-2 rounded', darkMode ? 'bg-gray-700 border-gray-600 text-white' : '']" />
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Alamat</label>
            <textarea v-model="form.alamat" :class="['w-full border px-3 py-2 rounded', darkMode ? 'bg-gray-700 border-gray-600 text-white' : '']"></textarea>
          </div>
          <div class="mb-4">
            <label class="block text-sm mb-1">Telp</label>
            <input v-model="form.telp" type="text" :class="['w-full border px-3 py-2 rounded', darkMode ? 'bg-gray-700 border-gray-600 text-white' : '']" />
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
const users = ref([])
const sekolah = ref([])
const showForm = ref(false)
const form = ref({ id: null, id_user: '', id_sekolah: '', nis: '', kelas: '', jurusan: '', alamat: '', telp: '' })

onMounted(() => { load(); loadOptions() })

async function load() {
  try {
    const res = await axios.get('/api/siswa')
    data.value = res.data.data
  } catch (e) {
    notif.showMessage('Gagal memuat data', 'error')
  }
}

async function loadOptions() {
  try {
    const [u, s] = await Promise.all([axios.get('/api/users'), axios.get('/api/sekolah')])
    users.value = u.data.data
    sekolah.value = s.data.data
  } catch (e) {}
}

function edit(item) {
  form.value = { id: item.id_siswa, id_user: item.id_user, id_sekolah: item.id_sekolah, nis: item.nis, kelas: item.kelas, jurusan: item.jurusan, alamat: item.alamat, telp: item.telp }
  showForm.value = true
}

function batal() {
  showForm.value = false
  form.value = { id: null, id_user: '', id_sekolah: '', nis: '', kelas: '', jurusan: '', alamat: '', telp: '' }
}

async function simpan() {
  if (loading.value) return
  loading.value = true
  try {
    if (form.value.id) {
      await axios.put(`/api/siswa/${form.value.id}`, form.value)
    } else {
      await axios.post('/api/siswa', form.value)
    }
    batal()
    load()
    notif.showMessage('Siswa berhasil disimpan')
  } catch (e) {
    notif.showMessage(e.response?.data?.message || 'Gagal menyimpan', 'error')
  } finally {
    loading.value = false
  }
}

async function hapus(id) {
  if (!confirm('Yakin hapus?')) return
  try {
    await axios.delete(`/api/siswa/${id}`)
    load()
    notif.showMessage('Siswa berhasil dihapus')
  } catch (e) {
    notif.showMessage('Gagal menghapus', 'error')
  }
}
</script>







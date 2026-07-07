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
    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-30" @click.self="batal">
      <div :class="['w-full max-w-md mx-4 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto', darkMode ? 'bg-gray-800' : 'bg-white']">
        <div :class="['flex items-center justify-between px-6 py-4 border-b', darkMode ? 'border-gray-700' : 'border-gray-200']">
          <div class="flex items-center gap-2">
            <div :class="'w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm ' + (form.id ? 'bg-blue-500' : 'bg-green-500')">
              <i :class="form.id ? 'fas fa-pen' : 'fas fa-plus'"></i>
            </div>
            <h3 class="text-lg font-bold">{{ form.id ? 'Edit' : 'Tambah' }} User</h3>
          </div>
          <button @click="batal" :class="'w-8 h-8 rounded-lg flex items-center justify-center hover:' + (darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500')">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <form @submit.prevent="simpan" class="p-6">
          <div class="mb-4">
            <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Nama</label>
            <input v-model="form.nama" type="text" required placeholder="Masukkan nama"
              :class="['w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition', darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400']" />
          </div>
          <div class="mb-4">
            <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Email</label>
            <input v-model="form.email" type="text" required placeholder="Masukkan email"
              :class="['w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition', darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400']" />
          </div>
          <div class="mb-4">
            <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Password <span :class="darkMode ? 'text-gray-500' : 'text-gray-400'">(isi jika ganti)</span></label>
            <input v-model="form.password" type="password" placeholder="Minimal 6 karakter"
              :class="['w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition', darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400']" />
          </div>
          <div class="mb-4">
            <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Role</label>
            <select v-model="form.role" required
              :class="['w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300']">
              <option value="admin">Admin</option>
              <option value="siswa">Siswa</option>
              <option value="guru_pembimbing">Guru Pembimbing</option>
              <option value="pembimbing_industri">Pembimbing Industri</option>
            </select>
          </div>

          <template v-if="form.role === 'siswa'">
            <div :class="['mb-4 pt-4 border-t', darkMode ? 'border-gray-700' : 'border-gray-200']">
              <p :class="['text-xs font-semibold uppercase tracking-wider mb-3', darkMode ? 'text-gray-400' : 'text-gray-500']">Data Siswa</p>
              <div class="mb-4">
                <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Sekolah</label>
                <select v-model="form.id_sekolah" required
                  :class="['w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300']">
                  <option value="">-- Pilih Sekolah --</option>
                  <option v-for="s in sekolah" :key="s.id_sekolah" :value="s.id_sekolah">{{ s.nama_sekolah }}</option>
                </select>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">NIS</label>
                  <input v-model="form.nis" type="text" required placeholder="Nomor induk siswa"
                    :class="['w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition', darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400']" />
                </div>
                <div>
                  <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Kelas</label>
                  <input v-model="form.kelas" type="text" required placeholder="Contoh: XII RPL 1"
                    :class="['w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition', darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400']" />
                </div>
              </div>
              <div class="mb-4">
                <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Jurusan</label>
                <input v-model="form.jurusan" type="text" required placeholder="Contoh: Rekayasa Perangkat Lunak"
                  :class="['w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition', darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400']" />
              </div>
              <div class="mb-4">
                <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Alamat</label>
                <textarea v-model="form.alamat" rows="2" placeholder="Alamat siswa"
                  :class="['w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition', darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400']"></textarea>
              </div>
              <div class="mb-2">
                <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Telp</label>
                <input v-model="form.telp" type="text" placeholder="Nomor telepon"
                  :class="['w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition', darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400']" />
              </div>
            </div>
          </template>

          <div class="flex gap-3 justify-end pt-4 border-t" :class="darkMode ? 'border-gray-700' : 'border-gray-200'">
            <button type="button" @click="batal"
              :class="['px-5 py-2.5 rounded-lg text-sm font-medium transition', darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700']">Batal</button>
            <button type="submit" :disabled="loading"
              class="px-5 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2">
              <i v-if="loading" class="fas fa-spinner fa-spin"></i>
              {{ loading ? "Menyimpan..." : "Simpan" }}
            </button>
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
const sekolah = ref([])
const showForm = ref(false)
const form = ref({ id: null, nama: '', email: '', password: '', role: 'siswa', id_sekolah: '', nis: '', kelas: '', jurusan: '', alamat: '', telp: '' })

onMounted(() => { load(); loadSekolah() })

async function loadSekolah() {
  try {
    const res = await axios.get('/api/sekolah')
    sekolah.value = res.data.data
  } catch (e) {}
}

async function load() {
  try {
    const res = await axios.get('/api/users')
    data.value = res.data.data
  } catch (e) {
    notif.showMessage('Gagal memuat data', 'error')
  }
}

function edit(item) {
  const s = item.siswa
  form.value = {
    id: item.id, nama: item.nama, email: item.email, password: '', role: item.role,
    id_sekolah: s?.id_sekolah || '', nis: s?.nis || '', kelas: s?.kelas || '',
    jurusan: s?.jurusan || '', alamat: s?.alamat || '', telp: s?.telp || '',
  }
  showForm.value = true
}

function batal() {
  showForm.value = false
  form.value = { id: null, nama: '', email: '', password: '', role: 'siswa', id_sekolah: '', nis: '', kelas: '', jurusan: '', alamat: '', telp: '' }
}

async function simpan() {
  if (loading.value) return
  loading.value = true
  try {
    if (form.value.password) {
      if (form.value.password.length < 8) { notif.showMessage('Password minimal 8 karakter', 'error'); loading.value = false; return }
      if (!/[A-Z]/.test(form.value.password)) { notif.showMessage('Password harus mengandung huruf besar', 'error'); loading.value = false; return }
      if (!/[0-9]/.test(form.value.password)) { notif.showMessage('Password harus mengandung angka', 'error'); loading.value = false; return }
      if (!/[^a-zA-Z0-9]/.test(form.value.password)) { notif.showMessage('Password harus mengandung simbol', 'error'); loading.value = false; return }
    }
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


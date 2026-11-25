<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Data Users</h3>
      <button @click="batal(); showForm = true" :class="['px-4 py-2 rounded-lg font-medium text-white transition-all', darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'light-btn-primary']">Tambah</button>
    </div>
    <DataTable :items="data" :columns="columns" id-key="id" actions-header="Aksi">
      <template #cell-role="{ item }">
        <span :class="['px-2 py-0.5 rounded text-xs font-medium',
          item.role === 'admin' ? 'bg-purple-100 text-purple-700' :
          item.role === 'pembimbing_sekolah' ? 'bg-blue-100 text-blue-700' :
          item.role === 'pembimbing_industri' ? 'bg-green-100 text-green-700' :
          'bg-yellow-100 text-yellow-700']">{{ item.role }}</span>
      </template>
      <template #actions="{ item }">
        <button @click="edit(item)" class="text-blue-600 hover:text-blue-800 mr-2" title="Edit"><i class="fas fa-edit"></i></button>
        <button @click="hapus(item.id)" class="text-red-600 hover:text-red-800" title="Hapus"><i class="fas fa-trash-alt"></i></button>
      </template>
    </DataTable>
    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-30" @click.self="batal">
      <div :class="['w-full max-w-md mx-4 rounded-2xl max-h-[90vh] overflow-y-auto', darkMode ? 'bg-gray-800 shadow-2xl' : 'light-modal']">
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
              :class="['w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition', darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'light-input placeholder-gray-400']" />
          </div>
          <div class="mb-4">
            <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Email</label>
            <input v-model="form.email" type="text" required placeholder="Masukkan email"
              :class="['w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition', darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'light-input placeholder-gray-400']" />
          </div>
          <div class="mb-4">
            <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Password <span :class="darkMode ? 'text-gray-500' : 'text-gray-400'">(isi jika ganti)</span></label>
            <input v-model="form.password" type="password" placeholder="Minimal 6 karakter"
              :class="['w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition', darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'light-input placeholder-gray-400']" />
          </div>
          <div class="mb-4">
            <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Role</label>
            <select v-model="form.role" required
              :class="['w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']">
              <option value="admin">Admin</option>
              <option value="siswa">Siswa</option>
              <option value="pembimbing_sekolah">Pembimbing Sekolah</option>
              <option value="pembimbing_industri">Pembimbing Industri</option>
            </select>
          </div>

          <template v-if="form.role === 'siswa' && !form.id">
            <div :class="['mb-4 pt-4 border-t', darkMode ? 'border-gray-700' : 'border-gray-200']">
              <p :class="['text-xs font-semibold uppercase tracking-wider mb-3', darkMode ? 'text-gray-400' : 'text-gray-500']">Data Siswa</p>
              <div class="mb-4">
                <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Sekolah</label>
                <select v-model="form.id_sekolah" required
                  :class="['w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']">
                  <option value="">-- Pilih Sekolah --</option>
                  <option v-for="s in sekolah" :key="s.id_sekolah" :value="s.id_sekolah">{{ s.nama_sekolah }}</option>
                </select>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">NIS</label>
                  <input v-model="form.nis" type="text" required placeholder="Nomor induk siswa"
                    :class="['w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition', darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'light-input placeholder-gray-400']" />
                </div>
                <div>
                  <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Kelas</label>
                  <input v-model="form.kelas" type="text" required placeholder="Contoh: XII RPL 1"
                    :class="['w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition', darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'light-input placeholder-gray-400']" />
                </div>
              </div>
<div class="mb-4">
            <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Jurusan</label>
            <input v-model="form.jurusan" type="text" required placeholder="Contoh: Rekayasa Perangkat Lunak"
              :class="['w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition', darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'light-input placeholder-gray-400']" />
          </div>
          <div class="mb-4">
            <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Bidang</label>
            <select v-model="form.id_tempat_pkl" required
              :class="['w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']">
                  <option value="">-- Pilih Bidang --</option>
                  <option v-for="t in tempatPkl" :key="t.id_tempat_pkl" :value="t.id_tempat_pkl">{{ t.nama_perusahaan }}</option>
                </select>
              </div>
              <div class="mb-4">
                <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Pembimbing Industri</label>
                <select v-model="form.id_pembimbing_industri" required
                  :class="['w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']">
                  <option value="">-- Pilih Pembimbing Industri --</option>
                  <option v-for="p in pembimbingIndustri" :key="p.id" :value="p.id">{{ p.nama }}</option>
                </select>
              </div>
              <div class="mb-4">
                <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Pembimbing Sekolah</label>
                <select v-model="form.id_pembimbing_sekolah" required
                  :class="['w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']">
                  <option value="">-- Pilih Pembimbing Sekolah --</option>
                  <option v-for="g in pembimbingSekolah" :key="g.id" :value="g.id">{{ g.nama }}</option>
                </select>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Tanggal Mulai</label>
                  <input v-model="form.tanggal_mulai" type="date"
                    :class="['w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']" />
                </div>
                <div>
                  <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Tanggal Selesai</label>
                  <input v-model="form.tanggal_selesai" type="date"
                    :class="['w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']" />
                </div>
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
import { useNotificationStore } from '../stores/notification'
import DataTable from '../components/DataTable.vue'
import axios from 'axios'
const notif = useNotificationStore()
const darkMode = false

const columns = [
  { key: "nama", label: "Nama", sortable: true, searchable: true },
  { key: "email", label: "Email", sortable: true, searchable: true },
  { key: "role", label: "Role", sortable: true, searchable: true },
];

const loading = ref(false)
const data = ref([])
const sekolah = ref([])
const tempatPkl = ref([])
const pembimbingIndustri = ref([])
const pembimbingSekolah = ref([])
const showForm = ref(false)
const form = ref({ id: null, nama: '', email: '', password: '', role: 'siswa', id_sekolah: '', nis: '', kelas: '', jurusan: '', alamat: '', telp: '', id_tempat_pkl: '', id_pembimbing_industri: '', id_pembimbing_sekolah: '', tanggal_mulai: '', tanggal_selesai: '' })

onMounted(() => { load(); loadSekolah(); loadTempatPkl(); loadPembimbingIndustri(); loadGuruPembimbing() })

async function loadSekolah() {
  try {
    const res = await axios.get('/api/sekolah')
    sekolah.value = res.data.data
  } catch (e) {}
}

async function loadTempatPkl() {
  try {
    const res = await axios.get('/api/tempat-pkl')
    tempatPkl.value = res.data.data
  } catch (e) {}
}

async function loadPembimbingIndustri() {
  try {
    const res = await axios.get('/api/users')
    pembimbingIndustri.value = res.data.data.filter(u => u.role === 'pembimbing_industri')
  } catch (e) {}
}

async function loadGuruPembimbing() {
  try {
    const res = await axios.get('/api/users')
    pembimbingSekolah.value = res.data.data.filter(u => u.role === 'pembimbing_sekolah')
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
    id_tempat_pkl: s?.penempatan?.id_tempat_pkl || '',
    id_pembimbing_industri: s?.penempatan?.id_pembimbing_industri || '',
    id_pembimbing_sekolah: s?.penempatan?.id_pembimbing_sekolah || '',
    tanggal_mulai: s?.penempatan?.tanggal_mulai || '',
    tanggal_selesai: s?.penempatan?.tanggal_selesai || '',
  }
  showForm.value = true
}

function batal() {
  showForm.value = false
  form.value = { id: null, nama: '', email: '', password: '', role: 'siswa', id_sekolah: '', nis: '', kelas: '', jurusan: '', alamat: '', telp: '', id_tempat_pkl: '', id_pembimbing_industri: '', id_pembimbing_sekolah: '', tanggal_mulai: '', tanggal_selesai: '' }
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
    if (form.value.id) {
      const payload = {
        nama: form.value.nama,
        email: form.value.email,
        role: form.value.role,
      };
      if (form.value.password) payload.password = form.value.password;
      await axios.put(`/api/users/${form.value.id}`, payload);
    } else {
      const payload = { ...form.value };
      delete payload.id;
      if (!payload.password) delete payload.password;
      await axios.post('/api/users', payload);
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


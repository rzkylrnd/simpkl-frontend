<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Data Presensi</h3>
      <button v-if="authStore.isSiswa" @click="openForm" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Tambah</button>
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
                <button @click="edit(item)" class="text-blue-600 hover:text-blue-800 mr-2" title="Edit"><i class="fas fa-edit"></i></button>
                <button @click="hapus(item.id_presensi)" class="text-red-600 hover:text-red-800" title="Hapus"><i class="fas fa-trash-alt"></i></button>
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
            <p :class="['text-sm font-medium py-2', darkMode ? 'text-gray-300' : 'text-gray-700']">
              <i class="fas fa-user-graduate mr-1"></i>{{ authStore.user?.nama }}
            </p>
          </div>
          <input v-model="form.id_siswa" type="hidden" />
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
            <textarea v-model="form.catatan" :class="['w-full border px-3 py-2 rounded', darkMode ? 'bg-gray-700 border-gray-600 text-white' : '']"></textarea>
          </div>
          <div class="flex gap-2 justify-end">
            <button type="button" @click="batal" class="px-4 py-2 border rounded hover:bg-gray-100">Batal</button>
            <button type="submit" :disabled="loading" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
              <i v-if="loading" class="fas fa-spinner fa-spin mr-1"></i>{{ loading ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useThemeStore } from '../stores/theme'
import { useAuthStore } from '../stores/auth'
import { useNotificationStore } from '../stores/notification'
import axios from 'axios'

const authStore = useAuthStore()
const themeStore = useThemeStore()
const notif = useNotificationStore()
const darkMode = computed(() => themeStore.darkMode)

const data = ref([])
const showForm = ref(false)
const loading = ref(false)
const form = ref({ id: null, id_siswa: '', tanggal: '', waktu_datang: '', waktu_pulang: '', catatan: '' })

onMounted(() => { load() })

async function load() {
  try {
    const res = await axios.get('/api/presensi')
    data.value = res.data.data
  } catch (e) {
    notif.showMessage('Gagal memuat data', 'error')
  }
}

function openForm() {
  form.value = { id: null, id_siswa: authStore.user?.siswa?.id_siswa || '', tanggal: '', waktu_datang: '', waktu_pulang: '', catatan: '' }
  showForm.value = true
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
  if (loading.value) return
  loading.value = true
  try {
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
    notif.showMessage('Presensi berhasil disimpan')
  } catch (e) {
    notif.showMessage(e.response?.data?.message || 'Gagal menyimpan', 'error')
  } finally {
    loading.value = false
  }
}

async function validasi(id, status) {
  try {
    await axios.put(`/api/presensi/${id}/validasi`, { status_validasi: status })
    load()
    notif.showMessage('Status presensi berhasil divalidasi')
  } catch (e) {
    notif.showMessage('Gagal validasi', 'error')
  }
}

async function hapus(id) {
  if (confirm('Yakin hapus?')) {
    try {
      await axios.delete(`/api/presensi/${id}`)
      load()
      notif.showMessage('Presensi berhasil dihapus')
    } catch (e) {
      notif.showMessage('Gagal menghapus', 'error')
    }
  }
}
</script>








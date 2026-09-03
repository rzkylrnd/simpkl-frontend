<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Data Jurnal Harian</h3>
      <button v-if="authStore.isSiswa" @click="openForm" :class="['px-4 py-2 rounded-lg font-medium text-white transition-all', darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'light-btn-primary']">Tambah</button>
    </div>
    <div :class="['rounded-xl shadow overflow-x-auto', darkMode ? 'bg-gray-800 border border-gray-700' : 'light-card']">
      <table class="w-full text-sm">
        <thead :class="darkMode ? 'bg-gray-700' : 'light-table-header'">
          <tr>
            <th class="p-3 text-left">Siswa</th>
            <th class="p-3 text-left">Tanggal</th>
            <th class="p-3 text-left">Kegiatan</th>
            <th class="p-3 text-center">Status</th>
            <th class="p-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in data" :key="item.id_jurnal" :class="[i % 2 === 0 ? (darkMode ? 'bg-gray-800' : 'bg-white') : (darkMode ? 'bg-gray-700' : 'bg-gray-50'), darkMode ? 'hover:bg-gray-600 transition-colors' : 'light-table-row']">
            <td class="p-3">{{ item.siswa?.user?.nama }}</td>
            <td class="p-3">{{ item.tanggal }}</td>
            <td class="p-3">{{ item.kegiatan }}</td>
            <td class="p-3 text-center whitespace-nowrap">
              <span v-if="item.status_validasi === 'valid'" class="inline-flex items-center bg-green-100 text-green-700 px-2.5 py-1 rounded-md text-xs font-bold">Valid</span>
              <span v-else-if="item.status_validasi === 'tidak_valid'" class="inline-flex items-center bg-red-100 text-red-700 px-2.5 py-1 rounded-md text-xs font-bold">Tidak Valid</span>
              <span v-else class="inline-flex items-center bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-md text-xs">Menunggu</span>
            </td>
            <td class="p-3 text-center whitespace-nowrap">
              <template v-if="authStore.isPembimbingIndustri && item.status_validasi === 'menunggu'">
                <button @click="validasi(item.id_jurnal, 'valid')" class="bg-green-600 text-white px-2.5 py-1 rounded-md text-xs hover:bg-green-700 font-semibold mr-1">Valid</button>
                <button @click="validasi(item.id_jurnal, 'tidak_valid')" class="bg-red-500 text-white px-2.5 py-1 rounded-md text-xs hover:bg-red-600 font-semibold">Tidak Valid</button>
              </template>
              <template v-else-if="authStore.isSiswa">
                <button @click="showDetail(item)" class="text-blue-600 hover:text-blue-800 mr-2" title="Lihat Detail"><i class="fas fa-eye"></i></button>
                <template v-if="item.status_validasi === 'menunggu'">
                  <button @click="edit(item)" class="text-blue-600 hover:text-blue-800 mr-2" title="Edit"><i class="fas fa-edit"></i></button>
                  <button @click="hapus(item.id_jurnal)" class="text-red-600 hover:text-red-800" title="Hapus"><i class="fas fa-trash-alt"></i></button>
                </template>
              </template>
              <template v-else-if="authStore.isAdmin">
                <button @click="showDetail(item)" class="text-blue-600 hover:text-blue-800" title="Lihat Detail"><i class="fas fa-eye"></i></button>
              </template>
              <span v-else :class="['text-xs', darkMode ? 'text-gray-500' : 'text-gray-400']">-</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div :class="['p-6 rounded-xl shadow-lg w-full max-w-md', darkMode ? 'bg-gray-800' : 'light-modal']">
        <h3 class="text-lg font-bold mb-4">{{ form.id ? 'Edit' : 'Tambah' }} Jurnal</h3>
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
            <div>
              <input
                v-model="form.tanggal"
                type="date"
                required
                :readonly="authStore.isSiswa && !form.id"
                :class="['w-full border px-3 py-2 rounded', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input', (authStore.isSiswa && !form.id) ? 'opacity-70 cursor-not-allowed' : '']"
              />
            </div>
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Kegiatan</label>
            <textarea v-model="form.kegiatan" required :class="['w-full border px-3 py-2 rounded', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']"></textarea>
          </div>
          <div class="flex gap-2 justify-end">
            <button type="button" @click="batal" :class="['px-4 py-2 border rounded', darkMode ? 'border-gray-600 hover:bg-gray-700' : 'light-btn-ghost text-gray-700']">Batal</button>
            <button type="submit" :disabled="loading" :class="['px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50', darkMode ? '' : 'shadow-sm']"><i v-if="loading" class="fas fa-spinner fa-spin mr-1"></i>{{ loading ? "Menyimpan..." : "Simpan" }}</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showDetailModal" class="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div :class="['p-6 rounded-xl shadow-lg w-full max-w-md', darkMode ? 'bg-gray-800' : 'light-modal']">
        <h3 class="text-lg font-bold mb-4">Detail Jurnal</h3>
        <div class="space-y-2 text-md">
          <p><span class="font-semibold">Tanggal:</span> {{ detailItem?.tanggal }}</p>
          <p><span class="font-semibold">Kegiatan:</span> {{ detailItem?.kegiatan }}</p>
          <p><span class="font-semibold">Status:</span>
            <span v-if="detailItem?.status_validasi === 'valid'" class="text-green-600 font-bold">Valid</span>
            <span v-else-if="detailItem?.status_validasi === 'tidak_valid'" class="text-red-600 font-bold">Tidak Valid</span>
            <span v-else class="text-yellow-600">Menunggu</span>
          </p>
        </div>
        <div class="flex justify-end mt-4">
          <button @click="showDetailModal = false" :class="['px-4 py-2 border rounded', darkMode ? 'border-gray-600 hover:bg-gray-700' : 'light-btn-ghost text-gray-700']">Tutup</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useThemeStore } from '../stores/theme'
import { useAuthStore } from '../stores/auth'
import { useNotificationStore } from '../stores/notification'
import axios from 'axios'

const authStore = useAuthStore()
const themeStore = useThemeStore()
const notif = useNotificationStore()
const darkMode = computed(() => themeStore.darkMode)

const loading = ref(false)
const data = ref([])
const showForm = ref(false)
const showDetailModal = ref(false)
const detailItem = ref(null)
const form = ref({ id: null, id_siswa: '', tanggal: '', kegiatan: '' })

onMounted(() => { load() })

async function load() {
  try {
    const res = await axios.get('/api/jurnal')
    data.value = res.data.data
  } catch (e) {
    notif.showMessage('Gagal memuat data', 'error')
  }
}

function openForm() {
  const today = new Date().toISOString().slice(0, 10);
  form.value = { id: null, id_siswa: authStore.user?.siswa?.id_siswa || '', tanggal: today, kegiatan: '' }
  showForm.value = true
}

function showDetail(item) {
  detailItem.value = item
  showDetailModal.value = true
}

function edit(item) {
  form.value = { id: item.id_jurnal, id_siswa: item.id_siswa, tanggal: item.tanggal, kegiatan: item.kegiatan }
  showForm.value = true
}

function batal() {
  showForm.value = false
  form.value = { id: null, id_siswa: '', tanggal: '', kegiatan: '' }
}

async function simpan() {
  if (loading.value) return
  loading.value = true
  try {
    const payload = { ...form.value }
    if (form.value.id) {
      await axios.put(`/api/jurnal/${form.value.id}`, payload)
    } else {
      await axios.post('/api/jurnal', payload)
    }
    batal()
    load()
    notif.showMessage('Jurnal berhasil disimpan')
  } catch (e) {
    notif.showMessage(e.response?.data?.message || 'Gagal menyimpan', 'error')
  } finally {
    loading.value = false
  }
}

async function validasi(id, status) {
  try {
    await axios.put(`/api/jurnal/${id}/validasi`, { status_validasi: status })
    load()
    notif.showMessage('Status jurnal berhasil divalidasi')
  } catch (e) {
    notif.showMessage('Gagal validasi', 'error')
  }
}

async function hapus(id) {
  if (!confirm('Yakin hapus?')) return
  try {
    await axios.delete(`/api/jurnal/${id}`)
    load()
    notif.showMessage('Jurnal berhasil dihapus')
  } catch (e) {
    notif.showMessage('Gagal menghapus', 'error')
  }
}
</script>









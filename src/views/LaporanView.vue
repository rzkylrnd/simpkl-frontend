<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Data Laporan Akhir</h3>
      <button v-if="authStore.isSiswa && !hasLaporan" @click="batal(); showForm = true" :class="['px-4 py-2 rounded-lg font-medium text-white transition-all', darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'light-btn-primary']">Tambah</button>
    </div>
    <DataTable :items="data" :columns="columns" id-key="id_laporan" actions-header="Aksi">
      <template #cell-file_path="{ item }">
        <a v-if="item.file_path" :href="item.file_path" target="_blank" class="text-blue-600 hover:underline">Buka Link</a>
        <span v-else class="text-gray-400">-</span>
      </template>
      <template #cell-file_upload="{ item }">
        <a v-if="item.file_upload" :href="'/storage/' + item.file_upload" target="_blank" class="text-blue-600 hover:underline">Download</a>
        <span v-else class="text-gray-400">-</span>
      </template>
      <template #cell-status_validasi="{ item }">
        <span v-if="item.status_validasi === 'valid'" class="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Valid</span>
        <span v-else-if="item.status_validasi === 'tidak_valid'" class="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">Tidak Valid</span>
        <span v-else class="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">Menunggu</span>
      </template>
      <template #actions="{ item }">
        <button @click="detail(item)" class="text-gray-600 hover:text-gray-800 mr-2" title="Detail"><i class="fas fa-eye"></i></button>
        <button @click="cetak(item)" class="text-green-600 hover:text-green-800 mr-2" title="Cetak"><i class="fas fa-print"></i></button>
        <template v-if="authStore.isPembimbingSekolah && item.status_validasi === 'menunggu'">
          <button @click="validasi(item.id_laporan, 'valid')" class="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 mr-1">Valid</button>
          <button @click="validasi(item.id_laporan, 'tidak_valid')" class="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600">Tidak Valid</button>
        </template>
        <template v-if="authStore.isSiswa && item.siswa?.id_siswa === authStore.user?.siswa?.id_siswa && item.status_validasi === 'menunggu'">
          <button @click="edit(item)" class="text-blue-600 hover:text-blue-800" title="Edit"><i class="fas fa-edit"></i></button>
        </template>
      </template>
    </DataTable>

    <!-- Form Modal -->
    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-30" @click.self="batal">
      <div :class="['w-full max-w-md mx-4 rounded-2xl shadow-2xl', darkMode ? 'bg-gray-800' : 'light-modal']">
        <div :class="['flex items-center justify-between px-6 py-4 border-b', darkMode ? 'border-gray-700' : 'border-gray-200']">
          <h3 class="text-lg font-bold">{{ form.id ? 'Edit' : 'Tambah' }} Laporan</h3>
          <button @click="batal" :class="'w-8 h-8 rounded-lg flex items-center justify-center hover:' + (darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500')">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <form @submit.prevent="simpan" class="p-6">
          <div v-if="!authStore.isSiswa" class="mb-3">
            <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Siswa</label>
            <select v-model="form.id_siswa" required :class="['w-full px-3 py-2.5 border rounded-lg', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']">
              <option value="">-- Pilih --</option>
              <option v-for="s in siswa" :key="s.id_siswa" :value="s.id_siswa">{{ s.user?.nama }}</option>
            </select>
          </div>
          <div class="mb-3">
            <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Judul Laporan</label>
            <input v-model="form.judul_laporan" type="text" required :class="['w-full px-3 py-2.5 border rounded-lg', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']" />
          </div>
          <div class="mb-3">
            <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Lampiran</label>
            <div class="flex gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" v-model="jenisLampiran" value="file" />
                <span>Upload File (PDF/DOC)</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" v-model="jenisLampiran" value="link" />
                <span>Link (Google Docs / Drive)</span>
              </label>
            </div>
          </div>
          <div v-if="jenisLampiran === 'file'" class="mb-3">
            <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Upload File</label>
            <input @change="onFileChange" type="file" accept=".pdf,.doc,.docx" :class="['w-full px-3 py-2.5 border rounded-lg', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']" />
          </div>
          <div v-if="jenisLampiran === 'link'" class="mb-3">
            <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Link Laporan</label>
            <input v-model="form.file_path" type="url" placeholder="https://docs.google.com/..." :class="['w-full px-3 py-2.5 border rounded-lg', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']" />
          </div>
          <div class="mb-4">
            <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Catatan</label>
            <textarea v-model="form.catatan" rows="3" :class="['w-full px-3 py-2.5 border rounded-lg', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']"></textarea>
          </div>
          <div class="flex gap-3 justify-end pt-4 border-t" :class="darkMode ? 'border-gray-700' : 'border-gray-200'">
            <button type="button" @click="batal" :class="['px-5 py-2.5 rounded-lg text-sm font-medium transition', darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'light-btn-ghost text-gray-700']">Batal</button>
            <button type="submit" :disabled="loading" :class="['px-5 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2', darkMode ? '' : 'shadow-sm']">
              <i v-if="loading" class="fas fa-spinner fa-spin"></i>
              {{ loading ? "Menyimpan..." : "Simpan" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="showDetail" class="fixed inset-0 bg-black/50 flex items-center justify-center z-30" @click.self="showDetail = false">
      <div :class="['w-full max-w-lg mx-4 rounded-2xl shadow-2xl', darkMode ? 'bg-gray-800' : 'light-modal']">
        <div :class="['flex items-center justify-between px-6 py-4 border-b', darkMode ? 'border-gray-700' : 'border-gray-200']">
          <h3 class="text-lg font-bold">Detail Laporan</h3>
          <button @click="showDetail = false" :class="'w-8 h-8 rounded-lg flex items-center justify-center hover:' + (darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500')">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-6 space-y-3">
          <div><span class="font-semibold">Siswa:</span> {{ detailItem?.siswa?.user?.nama }}</div>
          <div><span class="font-semibold">Judul:</span> {{ detailItem?.judul_laporan }}</div>
          <div><span class="font-semibold">Link:</span> <a v-if="detailItem?.file_path" :href="detailItem.file_path" target="_blank" class="text-blue-600 hover:underline">{{ detailItem.file_path }}</a><span v-else class="text-gray-400">-</span></div>
          <div><span class="font-semibold">File:</span> <a v-if="detailItem?.file_upload" :href="'/storage/' + detailItem.file_upload" target="_blank" class="text-blue-600 hover:underline">Download</a><span v-else class="text-gray-400">-</span></div>
          <div><span class="font-semibold">Status:</span>
            <span v-if="detailItem?.status_validasi === 'valid'" class="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold ml-1">Valid</span>
            <span v-else-if="detailItem?.status_validasi === 'tidak_valid'" class="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold ml-1">Tidak Valid</span>
            <span v-else class="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs ml-1">Menunggu</span>
          </div>
          <div v-if="detailItem?.catatan"><span class="font-semibold">Catatan:</span> {{ detailItem.catatan }}</div>
        </div>
      </div>
    </div>

    <!-- Cetak Modal -->
    <div v-if="showCetak" class="fixed inset-0 bg-black/50 flex items-center justify-center z-30" @click.self="showCetak = false">
      <div ref="cetakContent" :class="['w-full max-w-lg mx-4 rounded-2xl shadow-2xl', darkMode ? 'bg-gray-800' : 'light-modal']">
        <div :class="['flex items-center justify-between px-6 py-4 border-b print:hidden', darkMode ? 'border-gray-700' : 'border-gray-200']">
          <h3 class="text-lg font-bold">Cetak Laporan</h3>
          <div class="flex gap-2">
            <button @click="printLaporan" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"><i class="fas fa-print mr-1"></i>Print</button>
            <button @click="showCetak = false" :class="'w-8 h-8 rounded-lg flex items-center justify-center hover:' + (darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500')">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        <div class="p-8" id="cetak-area">
          <div class="text-center mb-6">
            <h1 class="text-xl font-bold uppercase">Laporan Akhir PKL</h1>
            <hr class="my-2 border-black" />
          </div>
          <table class="w-full text-sm">
            <tr><td class="py-1 font-semibold w-40">Nama Siswa</td><td>: {{ cetakItem?.siswa?.user?.nama }}</td></tr>
            <tr><td class="py-1 font-semibold">Judul Laporan</td><td>: {{ cetakItem?.judul_laporan }}</td></tr>
            <tr><td class="py-1 font-semibold">Link</td><td>: <span v-if="cetakItem?.file_path">{{ cetakItem.file_path }}</span><span v-else>-</span></td></tr>
            <tr><td class="py-1 font-semibold">Status</td><td>: {{ cetakItem?.status_validasi || 'Menunggu' }}</td></tr>
            <tr v-if="cetakItem?.catatan"><td class="py-1 font-semibold">Catatan</td><td>: {{ cetakItem.catatan }}</td></tr>
          </table>
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
import DataTable from '../components/DataTable.vue'

const authStore = useAuthStore()
const themeStore = useThemeStore()
const notif = useNotificationStore()
const darkMode = computed(() => themeStore.darkMode)

const columns = [
  { key: "siswa.user.nama", label: "Siswa", sortable: true, searchable: true },
  { key: "judul_laporan", label: "Judul", sortable: true, searchable: true },
  { key: "file_path", label: "Link", align: "center" },
  { key: "file_upload", label: "File", align: "center" },
  { key: "status_validasi", label: "Status", align: "center", sortable: true, searchable: true },
];

const loading = ref(false)
const data = ref([])
const siswa = ref([])
const showForm = ref(false)
const showDetail = ref(false)
const showCetak = ref(false)
const detailItem = ref(null)
const cetakItem = ref(null)
const fileToUpload = ref(null)
const jenisLampiran = ref('file')
const form = ref({ id: null, id_siswa: '', judul_laporan: '', file_path: '', catatan: '' })

const hasLaporan = computed(() =>
  authStore.isSiswa ? data.value.some(item => item.id_siswa === authStore.user?.siswa?.id_siswa) : false
)

onMounted(() => {
  load()
  if (!authStore.isSiswa) loadSiswa()
})

async function load() {
  try {
    const res = await axios.get('/api/laporan')
    data.value = res.data.data
  } catch (e) {
    notif.showMessage('Gagal memuat data', 'error')
  }
}

async function loadSiswa() {
  try {
    const res = await axios.get('/api/siswa')
    siswa.value = res.data.data
  } catch (e) {}
}

function onFileChange(e) {
  fileToUpload.value = e.target.files[0] || null
}

function edit(item) {
  form.value = {
    id: item.id_laporan,
    id_siswa: item.id_siswa,
    judul_laporan: item.judul_laporan,
    file_path: item.file_path || '',
    catatan: item.catatan || ''
  }
  jenisLampiran.value = item.file_upload ? 'file' : item.file_path ? 'link' : 'file'
  fileToUpload.value = null
  showForm.value = true
}

function detail(item) {
  detailItem.value = item
  showDetail.value = true
}

function cetak(item) {
  cetakItem.value = item
  showCetak.value = true
}

function printLaporan() {
  const el = document.getElementById('cetak-area')
  if (!el) return
  const original = document.body.innerHTML
  const printStyles = document.querySelectorAll('style, link[rel="stylesheet"]')
  const stylesHtml = Array.from(printStyles).map(s => s.outerHTML).join('')
  document.body.innerHTML = stylesHtml + el.outerHTML
  window.print()
  document.body.innerHTML = original
  window.location.reload()
}

function batal() {
  showForm.value = false
  form.value = { id: null, id_siswa: '', judul_laporan: '', file_path: '', catatan: '' }
  fileToUpload.value = null
  jenisLampiran.value = 'file'
}

async function simpan() {
  if (loading.value) return
  loading.value = true
  try {
    const payload = new FormData()
    payload.append('judul_laporan', form.value.judul_laporan)
    if (form.value.file_path) payload.append('file_path', form.value.file_path)
    if (form.value.catatan) payload.append('catatan', form.value.catatan)
    if (!authStore.isSiswa) payload.append('id_siswa', form.value.id_siswa)
    if (fileToUpload.value) payload.append('file_upload', fileToUpload.value)

    if (form.value.id) {
      payload.append('_method', 'PUT')
      await axios.post(`/api/laporan/${form.value.id}`, payload)
    } else {
      await axios.post('/api/laporan', payload)
    }
    batal()
    load()
    notif.showMessage('Laporan berhasil disimpan')
  } catch (e) {
    notif.showMessage(e.response?.data?.message || 'Gagal menyimpan', 'error')
  } finally {
    loading.value = false
  }
}

async function validasi(id, status) {
  try {
    await axios.put(`/api/laporan/${id}/validasi`, { status_validasi: status })
    load()
    notif.showMessage('Status laporan berhasil divalidasi')
  } catch (e) {
    notif.showMessage('Gagal validasi', 'error')
  }
}
</script>

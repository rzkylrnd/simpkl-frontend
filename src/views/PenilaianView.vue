<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Data Penilaian</h3>
      <button v-if="authStore.isGuruPembimbing" @click="batal(); showForm = true" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Tambah</button>
    </div>
    <div :class="['rounded shadow overflow-x-auto', darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white']">
      <table class="w-full text-sm">
        <thead :class="darkMode ? 'bg-gray-700' : 'bg-gray-50'">
          <tr>
            <th class="p-2 text-left">Siswa</th>
            <th class="p-2 text-left">Guru Pembimbing</th>
            <th class="p-2 text-left">Aspek</th>
            <th class="p-2 text-left">Nilai</th>
            <th class="p-2 text-left">Deskripsi</th>
            <th class="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in data" :key="item.id_penilaian" :class="[i % 2 === 0 ? (darkMode ? 'bg-gray-800' : 'bg-white') : (darkMode ? 'bg-gray-700' : 'bg-gray-50'), darkMode ? 'hover:bg-gray-600 transition-colors' : 'hover:bg-blue-50 transition-colors']">
            <td class="p-3">{{ item.siswa?.user?.nama }}</td>
            <td class="p-3">{{ item.guru_pembimbing?.nama }}</td>
            <td class="p-3">{{ item.aspek }}</td>
            <td class="p-3">{{ item.nilai }}</td>
            <td class="p-2 max-w-[200px] truncate">{{ item.deskripsi || '-' }}</td>
            <td class="p-3 text-center whitespace-nowrap">
              <button @click="detail(item)" class="text-gray-600 hover:text-gray-800 mr-2" title="Detail"><i class="fas fa-eye"></i></button>
              <button @click="cetak(item)" class="text-green-600 hover:text-green-800 mr-2" title="Cetak"><i class="fas fa-print"></i></button>
              <template v-if="authStore.isGuruPembimbing">
                <button @click="edit(item)" class="text-blue-600 hover:text-blue-800 mr-2" title="Edit"><i class="fas fa-edit"></i></button>
                <button @click="hapus(item.id_penilaian)" class="text-red-600 hover:text-red-800" title="Hapus"><i class="fas fa-trash-alt"></i></button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Form Modal -->
    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-30" @click.self="batal">
      <div :class="['w-full max-w-md mx-4 rounded-2xl shadow-2xl', darkMode ? 'bg-gray-800' : 'bg-white']">
        <div :class="['flex items-center justify-between px-6 py-4 border-b', darkMode ? 'border-gray-700' : 'border-gray-200']">
          <h3 class="text-lg font-bold">{{ form.id ? 'Edit' : 'Tambah' }} Penilaian</h3>
          <button @click="batal" :class="'w-8 h-8 rounded-lg flex items-center justify-center hover:' + (darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500')">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <form @submit.prevent="simpan" class="p-6">
          <div class="mb-3">
            <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Siswa</label>
            <select v-if="!form.id" v-model="form.id_siswa" required :class="['w-full px-3 py-2.5 border rounded-lg', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300']">
              <option value="">-- Pilih --</option>
              <option v-for="s in siswa" :key="s.id_siswa" :value="s.id_siswa">{{ s.user?.nama }}</option>
            </select>
            <input v-else :value="selectedSiswaNama" disabled :class="['w-full px-3 py-2.5 border rounded-lg bg-gray-100', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100']" />
          </div>
          <div class="mb-3">
            <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Guru Pembimbing</label>
            <select v-if="!form.id" v-model="form.id_guru_pembimbing" required :class="['w-full px-3 py-2.5 border rounded-lg', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300']">
              <option value="">-- Pilih --</option>
              <option v-for="g in guru" :key="g.id" :value="g.id">{{ g.nama }}</option>
            </select>
            <input v-else :value="selectedGuruNama" disabled :class="['w-full px-3 py-2.5 border rounded-lg bg-gray-100', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100']" />
          </div>
          <div class="mb-3">
            <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Aspek</label>
            <input v-model="form.aspek" type="text" required :class="['w-full px-3 py-2.5 border rounded-lg', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300']" />
          </div>
          <div class="mb-3">
            <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Nilai (0-100)</label>
            <input v-model.number="form.nilai" type="number" min="0" max="100" required :class="['w-full px-3 py-2.5 border rounded-lg', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300']" />
          </div>
          <div class="mb-4">
            <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Deskripsi</label>
            <textarea v-model="form.deskripsi" rows="3" :class="['w-full px-3 py-2.5 border rounded-lg', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300']"></textarea>
          </div>
          <div class="flex gap-3 justify-end pt-4 border-t" :class="darkMode ? 'border-gray-700' : 'border-gray-200'">
            <button type="button" @click="batal" :class="['px-5 py-2.5 rounded-lg text-sm font-medium transition', darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700']">Batal</button>
            <button type="submit" :disabled="loading" class="px-5 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2">
              <i v-if="loading" class="fas fa-spinner fa-spin"></i>
              {{ loading ? "Menyimpan..." : "Simpan" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="showDetail" class="fixed inset-0 bg-black/50 flex items-center justify-center z-30" @click.self="showDetail = false">
      <div :class="['w-full max-w-lg mx-4 rounded-2xl shadow-2xl', darkMode ? 'bg-gray-800' : 'bg-white']">
        <div :class="['flex items-center justify-between px-6 py-4 border-b', darkMode ? 'border-gray-700' : 'border-gray-200']">
          <h3 class="text-lg font-bold">Detail Penilaian</h3>
          <button @click="showDetail = false" :class="'w-8 h-8 rounded-lg flex items-center justify-center hover:' + (darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500')">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-6 space-y-3">
          <div><span class="font-semibold">Siswa:</span> {{ detailItem?.siswa?.user?.nama }}</div>
          <div><span class="font-semibold">Guru Pembimbing:</span> {{ detailItem?.guru_pembimbing?.nama }}</div>
          <div><span class="font-semibold">Aspek:</span> {{ detailItem?.aspek }}</div>
          <div><span class="font-semibold">Nilai:</span> {{ detailItem?.nilai }}</div>
          <div v-if="detailItem?.deskripsi"><span class="font-semibold">Deskripsi:</span> {{ detailItem.deskripsi }}</div>
        </div>
      </div>
    </div>

    <!-- Cetak Modal -->
    <div v-if="showCetak" class="fixed inset-0 bg-black/50 flex items-center justify-center z-30" @click.self="showCetak = false">
      <div :class="['w-full max-w-lg mx-4 rounded-2xl shadow-2xl', darkMode ? 'bg-gray-800' : 'bg-white']">
        <div :class="['flex items-center justify-between px-6 py-4 border-b print:hidden', darkMode ? 'border-gray-700' : 'border-gray-200']">
          <h3 class="text-lg font-bold">Cetak Penilaian</h3>
          <div class="flex gap-2">
            <button @click="printPenilaian" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"><i class="fas fa-print mr-1"></i>Print</button>
            <button @click="showCetak = false" :class="'w-8 h-8 rounded-lg flex items-center justify-center hover:' + (darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500')">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        <div class="p-8" id="cetak-area">
          <div class="text-center mb-6">
            <h1 class="text-xl font-bold uppercase">Lembar Penilaian PKL</h1>
            <hr class="my-2 border-black" />
          </div>
          <table class="w-full text-sm">
            <tr><td class="py-1 font-semibold w-44">Nama Siswa</td><td>: {{ cetakItem?.siswa?.user?.nama }}</td></tr>
            <tr><td class="py-1 font-semibold">Guru Pembimbing</td><td>: {{ cetakItem?.guru_pembimbing?.nama }}</td></tr>
            <tr><td class="py-1 font-semibold">Aspek</td><td>: {{ cetakItem?.aspek }}</td></tr>
            <tr><td class="py-1 font-semibold">Nilai</td><td>: {{ cetakItem?.nilai }}</td></tr>
            <tr v-if="cetakItem?.deskripsi"><td class="py-1 font-semibold">Deskripsi</td><td>: {{ cetakItem.deskripsi }}</td></tr>
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

const authStore = useAuthStore()
const themeStore = useThemeStore()
const notif = useNotificationStore()
const darkMode = computed(() => themeStore.darkMode)

const loading = ref(false)
const data = ref([])
const siswa = ref([])
const guru = ref([])
const showForm = ref(false)
const showDetail = ref(false)
const showCetak = ref(false)
const detailItem = ref(null)
const cetakItem = ref(null)
const form = ref({ id: null, id_siswa: '', id_guru_pembimbing: '', aspek: '', nilai: 0, deskripsi: '' })

const selectedSiswaNama = computed(() => {
  const s = siswa.value.find(x => x.id_siswa == form.value.id_siswa)
  return s?.user?.nama || ''
})

const selectedGuruNama = computed(() => {
  const g = guru.value.find(x => x.id == form.value.id_guru_pembimbing)
  return g?.nama || ''
})

onMounted(() => { load(); if (authStore.isAdmin || authStore.isGuruPembimbing) loadOptions() })

async function load() {
  try {
    const res = await axios.get('/api/penilaian')
    data.value = res.data.data
  } catch (e) {
    notif.showMessage('Gagal memuat data', 'error')
  }
}

async function loadOptions() {
  try {
    const [s, u] = await Promise.all([axios.get('/api/siswa'), axios.get('/api/users')])
    siswa.value = s.data.data
    guru.value = u.data.data.filter(x => x.role === 'guru_pembimbing')
  } catch (e) {}
}

function detail(item) {
  detailItem.value = item
  showDetail.value = true
}

function cetak(item) {
  cetakItem.value = item
  showCetak.value = true
}

function printPenilaian() {
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

function edit(item) {
  form.value = { id: item.id_penilaian, id_siswa: item.id_siswa, id_guru_pembimbing: item.id_guru_pembimbing, aspek: item.aspek, nilai: item.nilai, deskripsi: item.deskripsi || '' }
  showForm.value = true
}

function batal() {
  showForm.value = false
  form.value = { id: null, id_siswa: '', id_guru_pembimbing: '', aspek: '', nilai: 0, deskripsi: '' }
}

async function simpan() {
  if (loading.value) return
  loading.value = true
  try {
    if (form.value.id) {
      await axios.put(`/api/penilaian/${form.value.id}`, form.value)
    } else {
      await axios.post('/api/penilaian', form.value)
    }
    batal()
    load()
    notif.showMessage('Penilaian berhasil disimpan')
  } catch (e) {
    notif.showMessage(e.response?.data?.message || 'Gagal menyimpan', 'error')
  } finally {
    loading.value = false
  }
}

async function hapus(id) {
  if (!confirm('Yakin hapus?')) return
  try {
    await axios.delete(`/api/penilaian/${id}`)
    load()
    notif.showMessage('Penilaian berhasil dihapus')
  } catch (e) {
    notif.showMessage('Gagal menghapus', 'error')
  }
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Data Jurnal Harian</h3>
      <button v-if="authStore.isSiswa" @click="openForm" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Tambah</button>
    </div>
    <div :class="['rounded shadow overflow-x-auto', darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white']">
      <table class="w-full text-sm">
        <thead :class="darkMode ? 'bg-gray-700' : 'bg-gray-50'">
          <tr>
            <th class="p-2 text-left">Siswa</th>
            <th class="p-2 text-left">Tanggal</th>
            <th class="p-2 text-left">Kegiatan</th>
            <th class="p-2 text-left">Hasil</th>
            <th class="p-2 text-left">Kendala</th>
            <th class="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in data" :key="item.id_jurnal" :class="[i % 2 === 0 ? 'bg-white' : 'bg-gray-50', 'hover:bg-blue-50 transition-colors']">
            <td class="p-3">{{ item.siswa?.user?.nama }}</td>
            <td class="p-3">{{ item.tanggal }}</td>
            <td class="p-2 max-w-[200px] truncate">{{ item.kegiatan }}</td>
            <td class="p-2 max-w-[150px] truncate">{{ item.hasil || '-' }}</td>
            <td class="p-2 max-w-[150px] truncate">{{ item.kendala || '-' }}</td>
            <td class="p-3 text-center whitespace-nowrap">
              <button @click="edit(item)" class="text-blue-600 hover:text-blue-800 mr-2" title="Edit"><i class="fas fa-edit"></i></button>
              <button @click="hapus(item.id_jurnal)" class="text-red-600 hover:text-red-800" title="Hapus"><i class="fas fa-trash-alt"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div :class="['p-6 rounded shadow-lg w-full max-w-md', darkMode ? 'bg-gray-800' : 'bg-white']">
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
            <input v-model="form.tanggal" type="date" required class="w-full border px-3 py-2 rounded" />
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Kegiatan</label>
            <textarea v-model="form.kegiatan" required :class="['w-full border px-3 py-2 rounded', darkMode ? 'bg-gray-700 border-gray-600 text-white' : '']"></textarea>
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Hasil</label>
            <textarea v-model="form.hasil" :class="['w-full border px-3 py-2 rounded', darkMode ? 'bg-gray-700 border-gray-600 text-white' : '']"></textarea>
          </div>
          <div class="mb-4">
            <label class="block text-sm mb-1">Kendala</label>
            <textarea v-model="form.kendala" :class="['w-full border px-3 py-2 rounded', darkMode ? 'bg-gray-700 border-gray-600 text-white' : '']"></textarea>
          </div>
          <div class="flex gap-2 justify-end">
            <button type="button" @click="batal" class="px-4 py-2 border rounded hover:bg-gray-100">Batal</button>
            <button type="submit" :disabled="loading" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"><i v-if="loading" class="fas fa-spinner fa-spin mr-1"></i>{{ loading ? "Menyimpan..." : "Simpan" }}</button>
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

const loading = ref(false)
const data = ref([])
const showForm = ref(false)
const form = ref({ id: null, id_siswa: '', tanggal: '', kegiatan: '', hasil: '', kendala: '' })

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
  form.value = { id: null, id_siswa: authStore.user?.siswa?.id_siswa || '', tanggal: '', kegiatan: '', hasil: '', kendala: '' }
  showForm.value = true
}

function edit(item) {
  form.value = { id: item.id_jurnal, id_siswa: item.id_siswa, tanggal: item.tanggal, kegiatan: item.kegiatan, hasil: item.hasil || '', kendala: item.kendala || '' }
  showForm.value = true
}

function batal() {
  showForm.value = false
  form.value = { id: null, id_siswa: '', tanggal: '', kegiatan: '', hasil: '', kendala: '' }
}

async function simpan() {
  if (loading.value) return
  loading.value = true
  try {
    const payload = { ...form.value }
    if (!payload.hasil) delete payload.hasil
    if (!payload.kendala) delete payload.kendala
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









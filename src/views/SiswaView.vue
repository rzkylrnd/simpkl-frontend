<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Data Siswa</h3>
    </div>
    <div :class="['rounded-xl shadow overflow-x-auto', darkMode ? 'bg-gray-800 border border-gray-700' : 'light-card']">
      <table class="w-full text-sm">
        <thead :class="darkMode ? 'bg-gray-700' : 'light-table-header'">
          <tr>
            <th class="p-3 text-left">Nama</th>
            <th class="p-3 text-left">NIS</th>
            <th class="p-3 text-left">Sekolah</th>
            <th class="p-3 text-left">Kelas</th>
            <th class="p-3 text-left">Jurusan</th>
            <th class="p-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in data" :key="item.id_siswa" :class="[i % 2 === 0 ? (darkMode ? 'bg-gray-800' : 'bg-white') : (darkMode ? 'bg-gray-700' : 'bg-gray-50'), darkMode ? 'hover:bg-gray-600 transition-colors' : 'light-table-row']">
            <td class="p-3">{{ item.user?.nama }}</td>
            <td class="p-3">{{ item.nis }}</td>
            <td class="p-3">{{ item.sekolah?.nama_sekolah }}</td>
            <td class="p-3">{{ item.kelas }}</td>
            <td class="p-3">{{ item.jurusan }}</td>
            <td class="p-3 text-center">
              <button @click="detail(item)" class="text-gray-600 hover:text-gray-800 mr-2" title="Detail"><i class="fas fa-eye"></i></button>
              <button @click="edit(item)" class="text-blue-600 hover:text-blue-800" title="Edit"><i class="fas fa-edit"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Detail Modal -->
    <div v-if="showDetail" class="fixed inset-0 bg-black/50 flex items-center justify-center z-30" @click.self="showDetail = false">
      <div :class="['w-full max-w-lg mx-4 rounded-2xl shadow-2xl', darkMode ? 'bg-gray-800' : 'light-modal']">
        <div :class="['flex items-center justify-between px-6 py-4 border-b', darkMode ? 'border-gray-700' : 'border-gray-200']">
          <h3 class="text-lg font-bold">Detail Siswa</h3>
          <button @click="showDetail = false" :class="'w-8 h-8 rounded-lg flex items-center justify-center hover:' + (darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500')">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-6 space-y-3">
          <div><span class="font-semibold">Nama:</span> {{ detailItem?.user?.nama }}</div>
          <div><span class="font-semibold">Email:</span> {{ detailItem?.user?.email }}</div>
          <div><span class="font-semibold">NIS:</span> {{ detailItem?.nis }}</div>
          <div><span class="font-semibold">Sekolah:</span> {{ detailItem?.sekolah?.nama_sekolah }}</div>
          <div><span class="font-semibold">Kelas:</span> {{ detailItem?.kelas }}</div>
          <div><span class="font-semibold">Jurusan:</span> {{ detailItem?.jurusan }}</div>
          <div><span class="font-semibold">Alamat:</span> {{ detailItem?.alamat || '-' }}</div>
          <div><span class="font-semibold">Telp:</span> {{ detailItem?.telp || '-' }}</div>
          <div><span class="font-semibold">Tempat PKL:</span> {{ detailItem?.penempatan?.tempat_pkl?.nama_perusahaan || '-' }}</div>
          <div><span class="font-semibold">Pembimbing Industri:</span> {{ detailItem?.penempatan?.pembimbing_industri?.nama || '-' }}</div>
          <div><span class="font-semibold">Pembimbing Sekolah:</span> {{ detailItem?.penempatan?.pembimbing_sekolah?.nama || '-' }}</div>
        </div>
      </div>
    </div>
  <!-- Edit Modal -->
    <div v-if="showEdit" class="fixed inset-0 bg-black/50 flex items-center justify-center z-30" @click.self="showEdit = false">
      <div :class="['w-full max-w-lg mx-4 rounded-2xl shadow-2xl', darkMode ? 'bg-gray-800' : 'light-modal']">
        <div :class="['flex items-center justify-between px-6 py-4 border-b', darkMode ? 'border-gray-700' : 'border-gray-200']">
          <h3 class="text-lg font-bold">Edit Siswa</h3>
          <button @click="showEdit = false" :class="'w-8 h-8 rounded-lg flex items-center justify-center hover:' + (darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500')">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <form @submit.prevent="simpan" class="p-6 space-y-3">
          <div>
            <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Nama</label>
            <input v-model="form.nama" type="text" required :class="['w-full px-3 py-2.5 border rounded-lg', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']" />
          </div>
          <div>
            <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">NIS</label>
            <input v-model="form.nis" type="text" required :class="['w-full px-3 py-2.5 border rounded-lg', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']" />
          </div>
          <div>
            <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Sekolah</label>
            <select v-model="form.id_sekolah" required :class="['w-full px-3 py-2.5 border rounded-lg', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']">
              <option value="">-- Pilih --</option>
              <option v-for="s in sekolah" :key="s.id_sekolah" :value="s.id_sekolah">{{ s.nama_sekolah }}</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Kelas</label>
              <input v-model="form.kelas" type="text" required :class="['w-full px-3 py-2.5 border rounded-lg', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']" />
            </div>
            <div>
              <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Jurusan</label>
              <input v-model="form.jurusan" type="text" required :class="['w-full px-3 py-2.5 border rounded-lg', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']" />
            </div>
          </div>
          <div>
            <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Alamat</label>
            <textarea v-model="form.alamat" rows="2" :class="['w-full px-3 py-2.5 border rounded-lg', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']"></textarea>
          </div>
          <div>
            <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Telp</label>
            <input v-model="form.telp" type="text" :class="['w-full px-3 py-2.5 border rounded-lg', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']" />
          </div>
          <div class="flex gap-3 justify-end pt-4 border-t" :class="darkMode ? 'border-gray-700' : 'border-gray-200'">
            <button type="button" @click="showEdit = false" :class="['px-5 py-2.5 rounded-lg text-sm font-medium transition', darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'light-btn-ghost text-gray-700']">Batal</button>
            <button type="submit" :disabled="loading" :class="['px-5 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2', darkMode ? '' : 'shadow-sm']">
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

const data = ref([])
const showDetail = ref(false)
const detailItem = ref(null)
const showEdit = ref(false)
const loading = ref(false)
const sekolah = ref([])
const form = ref({ id: null, nama: '', nis: '', id_sekolah: '', kelas: '', jurusan: '', alamat: '', telp: '' })

onMounted(() => {
  load()
  loadSekolah()
})

async function load() {
  try {
    const res = await axios.get('/api/siswa')
    data.value = res.data.data
  } catch (e) {
    notif.showMessage('Gagal memuat data', 'error')
  }
}

async function loadSekolah() {
  try {
    const res = await axios.get('/api/sekolah')
    sekolah.value = res.data.data
  } catch (e) {}
}

function detail(item) {
  detailItem.value = item
  showDetail.value = true
}

function edit(item) {
  form.value = {
    id: item.id_siswa,
    nama: item.user?.nama || '',
    nis: item.nis || '',
    id_sekolah: item.id_sekolah || '',
    kelas: item.kelas || '',
    jurusan: item.jurusan || '',
    alamat: item.alamat || '',
    telp: item.telp || '',
  }
  showEdit.value = true
}

async function simpan() {
  if (loading.value) return
  loading.value = true
  try {
    const payload = { ...form.value }
    delete payload.id
    await axios.put(`/api/siswa/${form.value.id}`, payload)
    showEdit.value = false
    load()
    notif.showMessage('Siswa berhasil diupdate')
  } catch (e) {
    notif.showMessage(e.response?.data?.message || 'Gagal menyimpan', 'error')
  } finally {
    loading.value = false
  }
}
</script>

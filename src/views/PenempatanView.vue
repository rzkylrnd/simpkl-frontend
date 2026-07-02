<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Data Penempatan</h3>
      <button @click="showForm = true" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Tambah</button>
    </div>
    <div :class="['rounded shadow overflow-x-auto', darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white']">
      <table class="w-full text-sm">
        <thead :class="darkMode ? 'bg-gray-700' : 'bg-gray-50'">
          <tr>
            <th class="p-2 text-left">Siswa</th>
            <th class="p-2 text-left">Perusahaan</th>
            <th class="p-2 text-left">Guru Pembimbing</th>
            <th class="p-2 text-left">Pembimbing Industri</th>
            <th class="p-2 text-left">Mulai</th>
            <th class="p-2 text-left">Selesai</th>
            <th class="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in data" :key="item.id_penempatan" :class="[i % 2 === 0 ? 'bg-white' : 'bg-gray-50', 'hover:bg-blue-50 transition-colors']">
            <td class="p-3">{{ item.siswa?.user?.nama }}</td>
            <td class="p-3">{{ item.tempat_pkl?.nama_perusahaan }}</td>
            <td class="p-3">{{ item.guru_pembimbing?.nama }}</td>
            <td class="p-3">{{ item.pembimbing_industri?.nama }}</td>
            <td class="p-3">{{ item.tanggal_mulai }}</td>
            <td class="p-3">{{ item.tanggal_selesai }}</td>
            <td class="p-3 text-center whitespace-nowrap">
              <button @click="edit(item)" class="text-blue-600 hover:underline mr-2">Edit</button>
              <button @click="hapus(item.id_penempatan)" class="text-red-600 hover:underline">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div :class="['p-6 rounded shadow-lg w-full max-w-md', darkMode ? 'bg-gray-800' : 'bg-white']">
        <h3 class="text-lg font-bold mb-4">{{ form.id ? 'Edit' : 'Tambah' }} Penempatan</h3>
        <form @submit.prevent="simpan">
          <div class="mb-3">
            <label class="block text-sm mb-1">Siswa</label>
            <select v-if="!form.id" v-model="form.id_siswa" required class="w-full border px-3 py-2 rounded">
              <option value="">-- Pilih --</option>
              <option v-for="s in siswa" :key="s.id_siswa" :value="s.id_siswa">{{ s.user?.nama }}</option>
            </select>
            <input v-else :value="selectedSiswaNama" disabled class="w-full border px-3 py-2 rounded bg-gray-100" />
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Tempat PKL</label>
            <select v-model="form.id_tempat_pkl" required class="w-full border px-3 py-2 rounded">
              <option value="">-- Pilih --</option>
              <option v-for="t in tempatPkl" :key="t.id_tempat_pkl" :value="t.id_tempat_pkl">{{ t.nama_perusahaan }}</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Guru Pembimbing</label>
            <select v-model="form.id_guru_pembimbing" class="w-full border px-3 py-2 rounded">
              <option value="">-- Optional --</option>
              <option v-for="g in guru" :key="g.id" :value="g.id">{{ g.nama }}</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Pembimbing Industri</label>
            <select v-model="form.id_pembimbing_industri" class="w-full border px-3 py-2 rounded">
              <option value="">-- Optional --</option>
              <option v-for="p in industri" :key="p.id" :value="p.id">{{ p.nama }}</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Tanggal Mulai</label>
            <input v-model="form.tanggal_mulai" type="date" required class="w-full border px-3 py-2 rounded" />
          </div>
          <div class="mb-4">
            <label class="block text-sm mb-1">Tanggal Selesai</label>
            <input v-model="form.tanggal_selesai" type="date" required class="w-full border px-3 py-2 rounded" />
          </div>
          <div class="flex gap-2 justify-end">
            <button type="button" @click="batal" class="px-4 py-2 border rounded hover:bg-gray-100">Batal</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useThemeStore } from '../stores/theme'
import axios from 'axios'

const themeStore = useThemeStore()
const darkMode = computed(() => themeStore.darkMode)

const data = ref([])
const siswa = ref([])
const tempatPkl = ref([])
const guru = ref([])
const industri = ref([])
const showForm = ref(false)
const form = ref({ id: null, id_siswa: '', id_tempat_pkl: '', id_guru_pembimbing: '', id_pembimbing_industri: '', tanggal_mulai: '', tanggal_selesai: '' })

const selectedSiswaNama = computed(() => {
  const s = siswa.value.find(x => x.id_siswa == form.value.id_siswa)
  return s?.user?.nama || ''
})

onMounted(() => { load(); loadOptions() })

async function load() {
  const res = await axios.get('/api/penempatan')
  data.value = res.data.data
}

async function loadOptions() {
  try {
    const [s, t, u] = await Promise.all([
      axios.get('/api/siswa'),
      axios.get('/api/tempat-pkl'),
      axios.get('/api/users'),
    ])
    siswa.value = s.data.data
    tempatPkl.value = t.data.data
    guru.value = u.data.data.filter(x => x.role === 'guru_pembimbing')
    industri.value = u.data.data.filter(x => x.role === 'pembimbing_industri')
  } catch (e) {}
}

function edit(item) {
  form.value = {
    id: item.id_penempatan, id_siswa: item.id_siswa, id_tempat_pkl: item.id_tempat_pkl,
    id_guru_pembimbing: item.id_guru_pembimbing || '',
    id_pembimbing_industri: item.id_pembimbing_industri || '',
    tanggal_mulai: item.tanggal_mulai, tanggal_selesai: item.tanggal_selesai,
  }
  showForm.value = true
}

function batal() {
  showForm.value = false
  form.value = { id: null, id_siswa: '', id_tempat_pkl: '', id_guru_pembimbing: '', id_pembimbing_industri: '', tanggal_mulai: '', tanggal_selesai: '' }
}

async function simpan() {
  const payload = { ...form.value }
  if (!payload.id_guru_pembimbing) payload.id_guru_pembimbing = null
  if (!payload.id_pembimbing_industri) payload.id_pembimbing_industri = null
  if (form.value.id) {
    await axios.put(`/api/penempatan/${form.value.id}`, payload)
  } else {
    await axios.post('/api/penempatan', payload)
  }
  batal()
  load()
}

async function hapus(id) {
  if (confirm('Yakin hapus?')) {
    await axios.delete(`/api/penempatan/${id}`)
    load()
  }
}
</script>






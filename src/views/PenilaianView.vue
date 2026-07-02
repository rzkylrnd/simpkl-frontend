<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Data Penilaian</h3>
      <button v-if="authStore.isGuruPembimbing" @click="showForm = true" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Tambah</button>
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
          <tr v-for="(item, i) in data" :key="item.id_penilaian" :class="[i % 2 === 0 ? 'bg-white' : 'bg-gray-50', 'hover:bg-blue-50 transition-colors']">
            <td class="p-3">{{ item.siswa?.user?.nama }}</td>
            <td class="p-3">{{ item.guru_pembimbing?.nama }}</td>
            <td class="p-3">{{ item.aspek }}</td>
            <td class="p-3">{{ item.nilai }}</td>
            <td class="p-2 max-w-[200px] truncate">{{ item.deskripsi || '-' }}</td>
            <td class="p-3 text-center whitespace-nowrap">
              <button @click="edit(item)" class="text-blue-600 hover:underline mr-2">Edit</button>
              <button @click="hapus(item.id_penilaian)" class="text-red-600 hover:underline">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div :class="['p-6 rounded shadow-lg w-full max-w-md', darkMode ? 'bg-gray-800' : 'bg-white']">
        <h3 class="text-lg font-bold mb-4">{{ form.id ? 'Edit' : 'Tambah' }} Penilaian</h3>
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
            <label class="block text-sm mb-1">Guru Pembimbing</label>
            <select v-if="!form.id" v-model="form.id_guru_pembimbing" required class="w-full border px-3 py-2 rounded">
              <option value="">-- Pilih --</option>
              <option v-for="g in guru" :key="g.id" :value="g.id">{{ g.nama }}</option>
            </select>
            <input v-else :value="selectedGuruNama" disabled class="w-full border px-3 py-2 rounded bg-gray-100" />
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Aspek</label>
            <input v-model="form.aspek" type="text" required class="w-full border px-3 py-2 rounded" />
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Nilai (0-100)</label>
            <input v-model.number="form.nilai" type="number" min="0" max="100" required class="w-full border px-3 py-2 rounded" />
          </div>
          <div class="mb-4">
            <label class="block text-sm mb-1">Deskripsi</label>
            <textarea v-model="form.deskripsi" class="w-full border px-3 py-2 rounded"></textarea>
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
import { useAuthStore } from '../stores/auth'
import axios from 'axios'

const authStore = useAuthStore()
const themeStore = useThemeStore()
const darkMode = computed(() => themeStore.darkMode)

const data = ref([])
const siswa = ref([])
const guru = ref([])
const showForm = ref(false)
const form = ref({ id: null, id_siswa: '', id_guru_pembimbing: '', aspek: '', nilai: 0, deskripsi: '' })

const selectedSiswaNama = computed(() => {
  const s = siswa.value.find(x => x.id_siswa == form.value.id_siswa)
  return s?.user?.nama || ''
})

const selectedGuruNama = computed(() => {
  const g = guru.value.find(x => x.id == form.value.id_guru_pembimbing)
  return g?.nama || ''
})

onMounted(() => { load(); loadOptions() })

async function load() {
  const res = await axios.get('/api/penilaian')
  data.value = res.data.data
}

async function loadOptions() {
  try {
    const [s, u] = await Promise.all([axios.get('/api/siswa'), axios.get('/api/users')])
    siswa.value = s.data.data
    guru.value = u.data.data.filter(x => x.role === 'guru_pembimbing')
  } catch (e) {}
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
  if (form.value.id) {
    await axios.put(`/api/penilaian/${form.value.id}`, form.value)
  } else {
    await axios.post('/api/penilaian', form.value)
  }
  batal()
  load()
}

async function hapus(id) {
  if (confirm('Yakin hapus?')) {
    await axios.delete(`/api/penilaian/${id}`)
    load()
  }
}
</script>






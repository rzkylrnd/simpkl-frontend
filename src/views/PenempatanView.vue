<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Placement Data</h3>
      <button @click="batal(); showForm = true" :class="['px-4 py-2 rounded-lg font-medium text-white transition-all', darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'light-btn-primary']">Add</button>
    </div>
    <div :class="['rounded-xl shadow overflow-x-auto', darkMode ? 'bg-gray-800 border border-gray-700' : 'light-card']">
      <table class="w-full text-sm">
        <thead :class="darkMode ? 'bg-gray-700' : 'light-table-header'">
          <tr>
            <th class="p-3 text-left">Student</th>
            <th class="p-3 text-left">Company</th>
            <th class="p-3 text-left">Supervising Teacher</th>
            <th class="p-3 text-left">Industry Supervisor</th>
            <th class="p-3 text-left">Start</th>
            <th class="p-3 text-left">End</th>
            <th class="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in data" :key="item.id_penempatan" :class="[i % 2 === 0 ? (darkMode ? 'bg-gray-800' : 'bg-white') : (darkMode ? 'bg-gray-700' : 'bg-gray-50'), darkMode ? 'hover:bg-gray-600 transition-colors' : 'light-table-row']">
            <td class="p-3">{{ item.siswa?.user?.nama }}</td>
            <td class="p-3">{{ item.tempat_pkl?.nama_perusahaan }}</td>
            <td class="p-3">{{ item.guru_pembimbing?.nama }}</td>
            <td class="p-3">{{ item.pembimbing_industri?.nama }}</td>
            <td class="p-3">{{ item.tanggal_mulai }}</td>
            <td class="p-3">{{ item.tanggal_selesai }}</td>
            <td class="p-3 text-center whitespace-nowrap">
              <button @click="edit(item)" class="text-blue-600 hover:text-blue-800 mr-2" title="Edit"><i class="fas fa-edit"></i></button>
              <button @click="hapus(item.id_penempatan)" class="text-red-600 hover:text-red-800" title="Delete"><i class="fas fa-trash-alt"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div :class="['p-6 rounded-xl shadow-lg w-full max-w-md', darkMode ? 'bg-gray-800' : 'light-modal']">
        <h3 class="text-lg font-bold mb-4">{{ form.id ? 'Edit' : 'Add' }} Placement</h3>
        <form @submit.prevent="simpan">
          <div class="mb-3">
            <label class="block text-sm mb-1">Student</label>
            <select v-if="!form.id" v-model="form.id_siswa" required :class="['w-full border px-3 py-2 rounded', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']">
              <option value="">-- Select --</option>
              <option v-for="s in siswa" :key="s.id_siswa" :value="s.id_siswa">{{ s.user?.nama }}</option>
            </select>
            <input v-else :value="selectedSiswaNama" disabled :class="['w-full border px-3 py-2 rounded bg-gray-100', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100']" />
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Field Placement</label>
            <select v-model="form.id_tempat_pkl" required :class="['w-full border px-3 py-2 rounded', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']">
              <option value="">-- Select --</option>
              <option v-for="t in tempatPkl" :key="t.id_tempat_pkl" :value="t.id_tempat_pkl">{{ t.nama_perusahaan }}</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Supervising Teacher</label>
            <select v-model="form.id_guru_pembimbing" required :class="['w-full border px-3 py-2 rounded', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']">
              <option value="">-- Select Supervising Teacher --</option>
              <option v-for="g in guru" :key="g.id" :value="g.id">{{ g.nama }}</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Industry Supervisor</label>
            <select v-model="form.id_pembimbing_industri" required :class="['w-full border px-3 py-2 rounded', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']">
              <option value="">-- Select Industry Supervisor --</option>
              <option v-for="p in industri" :key="p.id" :value="p.id">{{ p.nama }}</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Start Date</label>
            <input v-model="form.tanggal_mulai" type="date" required :class="['w-full border px-3 py-2 rounded', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']" />
          </div>
          <div class="mb-4">
            <label class="block text-sm mb-1">End Date</label>
            <input v-model="form.tanggal_selesai" type="date" required :class="['w-full border px-3 py-2 rounded', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']" />
          </div>
          <div class="flex gap-2 justify-end">
            <button type="button" @click="batal" :class="['px-4 py-2 border rounded', darkMode ? 'border-gray-600 hover:bg-gray-700' : 'light-btn-ghost text-gray-700']">Cancel</button>
            <button type="submit" :disabled="loading" :class="['px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50', darkMode ? '' : 'shadow-sm']"><i v-if="loading" class="fas fa-spinner fa-spin mr-1"></i>{{ loading ? "Saving..." : "Save" }}</button>
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
  try {
    const res = await axios.get('/api/penempatan')
    data.value = res.data.data
  } catch (e) {
    notif.showMessage('Failed to load data', 'error')
  }
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
  if (loading.value) return
  loading.value = true
  try {
    const payload = { ...form.value }
    if (form.value.id) {
      await axios.put(`/api/penempatan/${form.value.id}`, payload)
    } else {
      await axios.post('/api/penempatan', payload)
    }
    batal()
    load()
    notif.showMessage('Placement saved successfully')
  } catch (e) {
    notif.showMessage(e.response?.data?.message || 'Failed to save', 'error')
  } finally {
    loading.value = false
  }
}

async function hapus(id) {
  if (!confirm('Are you sure you want to delete?')) return
  try {
    await axios.delete(`/api/penempatan/${id}`)
    load()
    notif.showMessage('Placement deleted successfully')
  } catch (e) {
    notif.showMessage('Failed to delete', 'error')
  }
}
</script>








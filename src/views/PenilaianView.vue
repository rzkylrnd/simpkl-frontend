<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Assessment Data</h3>
      <button v-if="authStore.isPembimbingIndustri" @click="batal(); showForm = true" :class="['px-4 py-2 rounded-lg font-medium text-white transition-all', darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'light-btn-primary']">Add</button>
    </div>

    <div :class="['rounded-xl shadow overflow-x-auto', darkMode ? 'bg-gray-800 border border-gray-700' : 'light-card']">
      <table class="w-full text-sm">
        <thead :class="darkMode ? 'bg-gray-700' : 'light-table-header'">
          <tr>
            <th class="p-3 text-left">Student</th>
            <th class="p-3 text-center" title="Attendance, punctuality">Discipline</th>
            <th class="p-3 text-center" title="Completes tasks well">Responsibility</th>
            <th class="p-3 text-center" title="Politeness, behavior">Attitude &amp; Ethics</th>
            <th class="p-3 text-center" title="Works in a team">Teamwork</th>
            <th class="p-3 text-center" title="Proactive, willing to learn">Initiative</th>
            <th class="p-3 text-center" title="Accuracy, quality">Quality of Results</th>
            <th class="p-3 text-center" title="Technical ability">Competency</th>
            <th class="p-3 text-center" title="Safety procedures">OHS</th>
            <th class="p-3 text-center">Total</th>
            <th class="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in data" :key="item.id_penilaian" :class="[i % 2 === 0 ? (darkMode ? 'bg-gray-800' : 'bg-white') : (darkMode ? 'bg-gray-700' : 'bg-gray-50'), darkMode ? 'hover:bg-gray-600 transition-colors' : 'light-table-row']">
            <td class="p-3 whitespace-nowrap">{{ item.siswa?.user?.nama }}</td>
            <td class="p-3 text-center" :class="nilaiColor(item.disiplin)">{{ item.disiplin }}</td>
            <td class="p-3 text-center" :class="nilaiColor(item.tanggung_jawab)">{{ item.tanggung_jawab }}</td>
            <td class="p-3 text-center" :class="nilaiColor(item.sikap_etika)">{{ item.sikap_etika }}</td>
            <td class="p-3 text-center" :class="nilaiColor(item.kerja_sama)">{{ item.kerja_sama }}</td>
            <td class="p-3 text-center" :class="nilaiColor(item.inisiatif)">{{ item.inisiatif }}</td>
            <td class="p-3 text-center" :class="nilaiColor(item.kualitas_hasil)">{{ item.kualitas_hasil }}</td>
            <td class="p-3 text-center" :class="nilaiColor(item.penguasaan)">{{ item.penguasaan }}</td>
            <td class="p-3 text-center" :class="nilaiColor(item.keselamatan_kerja)">{{ item.keselamatan_kerja }}</td>
            <td class="p-3 text-center font-bold" :class="nilaiColor(item.total)">{{ item.total }}</td>
            <td class="p-3 text-center whitespace-nowrap">
              <button @click="detail(item)" class="text-gray-600 hover:text-gray-800 mr-2" title="Detail"><i class="fas fa-eye"></i></button>
              <button @click="cetak(item)" class="text-green-600 hover:text-green-800 mr-2" title="Print"><i class="fas fa-print"></i></button>
              <template v-if="authStore.isPembimbingIndustri || authStore.isAdmin">
                <button @click="edit(item)" class="text-blue-600 hover:text-blue-800 mr-2" title="Edit"><i class="fas fa-edit"></i></button>
                <button v-if="authStore.isAdmin" @click="hapus(item.id_penilaian)" class="text-red-600 hover:text-red-800" title="Delete"><i class="fas fa-trash-alt"></i></button>
              </template>
            </td>
          </tr>
          <tr v-if="!data.length">
            <td colspan="11" class="p-6 text-center" :class="darkMode ? 'text-gray-400' : 'text-gray-500'">No assessment data</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Form Modal -->
    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-30" @click.self="batal">
      <div :class="['w-full max-w-2xl mx-4 rounded-2xl max-h-[90vh] overflow-y-auto', darkMode ? 'bg-gray-800 shadow-2xl' : 'light-modal']">
        <div :class="['flex items-center justify-between px-6 py-4 border-b', darkMode ? 'border-gray-700' : 'border-gray-200']">
          <h3 class="text-lg font-bold">{{ form.id ? 'Edit' : 'Add' }} Assessment</h3>
          <button @click="batal" :class="'w-8 h-8 rounded-lg flex items-center justify-center hover:' + (darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500')">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <form @submit.prevent="simpan" class="p-6">
          <div class="mb-5">
            <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Student</label>
            <select v-if="!form.id" v-model="form.id_siswa" required :class="['w-full px-3 py-2.5 border rounded-lg', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']">
              <option value="">-- Select --</option>
              <option v-for="s in siswaTersedia" :key="s.id_siswa" :value="s.id_siswa">{{ s.user?.nama }}</option>
            </select>
            <p v-if="!form.id && belumDinilaiSemua" :class="['text-xs mt-1', darkMode ? 'text-yellow-400' : 'text-yellow-600']"><i class="fas fa-exclamation-triangle mr-1"></i>All supervised students have already been assessed.</p>
            <input v-else :value="selectedSiswaNama" disabled :class="['w-full px-3 py-2.5 border rounded-lg', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 text-gray-500']" />
            <input :value="authStore.user?.nama" disabled :class="['w-full px-3 py-2.5 border rounded-lg mt-2', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 text-gray-500']" />
            <p :class="['text-[10px] uppercase tracking-wide mt-1 text-center', darkMode ? 'text-gray-500' : 'text-gray-400']">Industry Supervisor</p>
          </div>

          <div :class="['mb-5 rounded-xl p-4 border', darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200']">
            <p :class="['text-xs font-semibold uppercase tracking-wider mb-3', darkMode ? 'text-gray-300' : 'text-gray-600']">Aspect Scores (0-100)</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-for="b in bobot" :key="b.key">
                <label :class="['block text-sm font-medium mb-1 text-left', darkMode ? 'text-gray-300' : 'text-gray-700']">{{ b.nama }}</label>
                <input v-model.number="form[b.key]" type="number" min="0" max="100" required :class="['w-full px-3 py-2 border rounded-lg', darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'light-input']" />
              </div>
            </div>
          </div>

          <div :class="['flex items-center justify-between rounded-xl p-4 mb-5 border', darkMode ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-200']">
            <span :class="['text-sm font-semibold', darkMode ? 'text-gray-200' : 'text-gray-700']">Final Score (average of aspects)</span>
            <span :class="['text-2xl font-bold tabular-nums', nilaiColor(formTotal)]">{{ formTotal }}</span>
          </div>

          <div class="mb-4">
            <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Notes <span :class="darkMode ? 'text-gray-500' : 'text-gray-400'">(optional)</span></label>
            <textarea v-model="form.keterangan" rows="2" :class="['w-full px-3 py-2.5 border rounded-lg', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']"></textarea>
          </div>

          <div class="flex gap-3 justify-end pt-4 border-t" :class="darkMode ? 'border-gray-700' : 'border-gray-200'">
            <button type="button" @click="batal" :class="['px-5 py-2.5 rounded-lg text-sm font-medium transition', darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'light-btn-ghost text-gray-700']">Cancel</button>
            <button type="submit" :disabled="loading" :class="['px-5 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2', darkMode ? '' : 'shadow-sm']">
              <i v-if="loading" class="fas fa-spinner fa-spin"></i>
              {{ loading ? "Saving..." : "Save" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="showDetail" class="fixed inset-0 bg-black/50 flex items-center justify-center z-30" @click.self="showDetail = false">
      <div :class="['w-full max-w-2xl mx-4 rounded-2xl', darkMode ? 'bg-gray-800 shadow-2xl' : 'light-modal']">
        <div :class="['flex items-center justify-between px-6 py-4 border-b', darkMode ? 'border-gray-700' : 'border-gray-200']">
          <h3 class="text-lg font-bold">Assessment Detail</h3>
          <button @click="showDetail = false" :class="'w-8 h-8 rounded-lg flex items-center justify-center hover:' + (darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500')">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-6">
          <div class="mb-4">
            <div><span class="font-semibold">Student:</span> {{ detailItem?.siswa?.user?.nama }}</div>
            <div><span class="font-semibold">Industry Supervisor:</span> {{ detailItem?.pembimbing_industri?.nama }}</div>
          </div>
          <table class="w-full text-sm">
            <tbody>
              <tr v-for="b in bobot" :key="b.key" :class="darkMode ? 'border-b border-gray-700' : 'border-b border-gray-100'">
                <td class="py-1.5">{{ b.nama }}</td>
                <td class="py-1.5 text-right font-semibold" :class="nilaiColor(detailItem?.[b.key])">{{ detailItem?.[b.key] }}</td>
              </tr>
              <tr class="mt-2">
                <td class="py-2 font-bold">Final Score</td>
                <td class="py-2 text-right font-bold text-lg" :class="nilaiColor(detailItem?.total)">{{ detailItem?.total }}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="detailItem?.keterangan" class="mt-3"><span class="font-semibold">Notes:</span> {{ detailItem.keterangan }}</div>
        </div>
      </div>
    </div>

    <!-- Cetak Modal -->
    <div v-if="showCetak" class="fixed inset-0 bg-black/50 flex items-center justify-center z-30" @click.self="showCetak = false">
      <div :class="['w-full max-w-2xl mx-4 rounded-2xl', darkMode ? 'bg-gray-800' : 'bg-white']">
        <div :class="['flex items-center justify-between px-6 py-4 border-b print:hidden', darkMode ? 'border-gray-700' : 'border-gray-200']">
          <h3 class="text-lg font-bold">Print Assessment</h3>
          <div class="flex gap-2">
            <button @click="printCetak" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"><i class="fas fa-print mr-1"></i>Print</button>
            <button @click="showCetak = false" :class="'w-8 h-8 rounded-lg flex items-center justify-center hover:' + (darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500')">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        <div class="p-8" id="cetak-area">
          <div class="text-center mb-6">
            <h1 class="text-xl font-bold uppercase">PKL Assessment Sheet</h1>
            <hr class="my-2 border-black" />
          </div>
          <table class="w-full text-sm mb-4">
            <tr><td class="py-1 font-semibold w-44">Student Name</td><td>: {{ cetakItem?.siswa?.user?.nama }}</td></tr>
            <tr><td class="py-1 font-semibold">Industry Supervisor</td><td>: {{ cetakItem?.pembimbing_industri?.nama }}</td></tr>
          </table>
          <table class="w-full text-sm border">
            <thead class="bg-gray-100">
              <tr>
                <th class="p-2 border text-left">Aspect</th>
                <th class="p-2 border text-center">Score</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="b in bobot" :key="b.key">
                <td class="p-2 border">{{ b.nama }}</td>
                <td class="p-2 border text-center font-bold" :class="nilaiColor(cetakItem?.[b.key])">{{ cetakItem?.[b.key] }}</td>
              </tr>
              <tr>
                <td class="p-2 border font-bold">Final Score (average)</td>
                <td class="p-2 border text-center font-bold text-lg" :class="nilaiColor(cetakItem?.total)">{{ cetakItem?.total }}</td>
              </tr>
            </tbody>
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
const showForm = ref(false)
const showDetail = ref(false)
const showCetak = ref(false)
const detailItem = ref(null)
const cetakItem = ref(null)
const form = ref(buatForm())

const bobot = [
  { key: 'disiplin', nama: 'Discipline', bobot: 15 },
  { key: 'tanggung_jawab', nama: 'Responsibility', bobot: 15 },
  { key: 'sikap_etika', nama: 'Attitude & Work Ethics', bobot: 15 },
  { key: 'kerja_sama', nama: 'Teamwork', bobot: 10 },
  { key: 'inisiatif', nama: 'Initiative', bobot: 10 },
  { key: 'kualitas_hasil', nama: 'Quality of Work', bobot: 15 },
  { key: 'penguasaan', nama: 'Competency Mastery', bobot: 15 },
  { key: 'keselamatan_kerja', nama: 'Occupational Safety (OHS)', bobot: 5 },
]

function buatForm() {
  return {
    id: null,
    id_siswa: '',
    disiplin: 0,
    tanggung_jawab: 0,
    sikap_etika: 0,
    kerja_sama: 0,
    inisiatif: 0,
    kualitas_hasil: 0,
    penguasaan: 0,
    keselamatan_kerja: 0,
    keterangan: '',
  }
}

const formTotal = computed(() => {
  const nilai = bobot.map(b => Number(form.value[b.key]) || 0)
  return (nilai.reduce((a, b) => a + b, 0) / nilai.length).toFixed(2)
})

const selectedSiswaNama = computed(() => {
  const s = siswa.value.find(x => x.id_siswa == form.value.id_siswa)
  return s?.user?.nama || ''
})

const sudahDinilaiIds = computed(() => {
  return new Set(data.value.map(i => i.id_siswa))
})

const siswaTersedia = computed(() => {
  return siswa.value.filter(s => !sudahDinilaiIds.value.has(s.id_siswa))
})

const belumDinilaiSemua = computed(() => siswaTersedia.value.length === 0)

function nilaiColor(val) {
  const n = Number(val)
  if (isNaN(n)) return darkMode.value ? 'text-gray-400' : 'text-gray-400'
  if (n >= 75) return 'text-green-600'
  if (n >= 50) return 'text-yellow-500'
  return 'text-red-600'
}

onMounted(() => { load(); if (authStore.isAdmin || authStore.isPembimbingIndustri) loadOptions() })

async function load() {
  try {
    const res = await axios.get('/api/penilaian')
    data.value = res.data.data
  } catch (e) {
    notif.showMessage('Failed to load data', 'error')
  }
}

async function loadOptions() {
  try {
    if (authStore.isPembimbingIndustri) {
      const res = await axios.get('/api/siswa-binaan')
      siswa.value = res.data.data
    } else {
      const res = await axios.get('/api/siswa')
      siswa.value = res.data.data
    }
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

function printCetak() {
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
  form.value = {
    id: item.id_penilaian,
    id_siswa: item.id_siswa,
    disiplin: item.disiplin,
    tanggung_jawab: item.tanggung_jawab,
    sikap_etika: item.sikap_etika,
    kerja_sama: item.kerja_sama,
    inisiatif: item.inisiatif,
    kualitas_hasil: item.kualitas_hasil,
    penguasaan: item.penguasaan,
    keselamatan_kerja: item.keselamatan_kerja,
    keterangan: item.keterangan || '',
  }
  showForm.value = true
}

function batal() {
  showForm.value = false
  form.value = buatForm()
}

async function simpan() {
  if (loading.value) return

  if (!form.value.id) {
    const ok = confirm('Are you sure you want to finalize and save this assessment?\n\nAfter saving, this student cannot be reassessed.')
    if (!ok) return
  }

  loading.value = true
  try {
    const payload = { ...form.value }
    if (!payload.keterangan) delete payload.keterangan
    if (form.value.id) {
      await axios.put(`/api/penilaian/${form.value.id}`, payload)
    } else {
      await axios.post('/api/penilaian', payload)
    }
    batal()
    load()
    notif.showMessage('Assessment saved successfully')
  } catch (e) {
    notif.showMessage(e.response?.data?.message || 'Failed to save', 'error')
  } finally {
    loading.value = false
  }
}

async function hapus(id) {
  if (!confirm('Are you sure you want to delete?')) return
  try {
    await axios.delete(`/api/penilaian/${id}`)
    load()
    notif.showMessage('Assessment deleted successfully')
  } catch (e) {
    notif.showMessage('Failed to delete', 'error')
  }
}
</script>

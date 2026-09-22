<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Data Penilaian</h3>
      <button v-if="authStore.isPembimbingIndustri" @click="batal(); showForm = true" :class="['px-4 py-2 rounded-lg font-medium text-white transition-all', darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'light-btn-primary']">Tambah</button>
    </div>

    <DataTable :items="data" :columns="columns" id-key="id_penilaian" actions-header="Aksi">
      <template #actions="{ item }">
        <button @click="detail(item)" class="text-gray-600 hover:text-gray-800 mr-2" title="Detail"><i class="fas fa-eye"></i></button>
        <button @click="cetak(item)" class="text-green-600 hover:text-green-800 mr-2" title="Cetak"><i class="fas fa-print"></i></button>
        <template v-if="authStore.isPembimbingIndustri || authStore.isAdmin">
          <button @click="edit(item)" class="text-blue-600 hover:text-blue-800 mr-2" title="Edit"><i class="fas fa-edit"></i></button>
          <button v-if="authStore.isAdmin" @click="hapus(item.id_penilaian)" class="text-red-600 hover:text-red-800" title="Hapus"><i class="fas fa-trash-alt"></i></button>
        </template>
      </template>
    </DataTable>

    <!-- Form Modal -->
    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-30" @click.self="batal">
      <div :class="['w-full max-w-2xl mx-4 rounded-2xl max-h-[90vh] overflow-y-auto', darkMode ? 'bg-gray-800 shadow-2xl' : 'light-modal']">
        <div :class="['flex items-center justify-between px-6 py-4 border-b', darkMode ? 'border-gray-700' : 'border-gray-200']">
          <h3 class="text-lg font-bold">{{ form.id ? 'Edit' : 'Tambah' }} Penilaian</h3>
          <button @click="batal" :class="'w-8 h-8 rounded-lg flex items-center justify-center hover:' + (darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500')">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <form @submit.prevent="simpan" class="p-6">
          <div class="mb-5">
            <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Siswa</label>
            <select v-if="!form.id" v-model="form.id_siswa" required :class="['w-full px-3 py-2.5 border rounded-lg', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']">
              <option value="">-- Pilih --</option>
              <option v-for="s in siswaTersedia" :key="s.id_siswa" :value="s.id_siswa">{{ s.user?.nama }}</option>
            </select>
            <p v-if="!form.id && belumDinilaiSemua" :class="['text-xs mt-1', darkMode ? 'text-yellow-400' : 'text-yellow-600']"><i class="fas fa-exclamation-triangle mr-1"></i>Semua siswa binaan sudah dinilai.</p>
            <input v-else :value="selectedSiswaNama" disabled :class="['w-full px-3 py-2.5 border rounded-lg', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 text-gray-500']" />
            <input :value="authStore.user?.nama" disabled :class="['w-full px-3 py-2.5 border rounded-lg mt-2', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 text-gray-500']" />
            <p :class="['text-[10px] uppercase tracking-wide mt-1 text-center', darkMode ? 'text-gray-500' : 'text-gray-400']">Pembimbing Industri</p>
          </div>

          <div :class="['mb-5 rounded-xl p-4 border', darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200']">
            <p :class="['text-xs font-semibold uppercase tracking-wider mb-3', darkMode ? 'text-gray-300' : 'text-gray-600']">Nilai Aspek (0-100)</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-for="b in bobot" :key="b.key">
                <label :class="['block text-sm font-medium mb-1 text-left', darkMode ? 'text-gray-300' : 'text-gray-700']">{{ b.nama }}</label>
                <input v-model.number="form[b.key]" type="number" min="0" max="100" required :class="['w-full px-3 py-2 border rounded-lg', darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'light-input']" />
              </div>
            </div>
          </div>

          <div :class="['flex items-center justify-between rounded-xl p-4 mb-5 border', darkMode ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-200']">
            <span :class="['text-sm font-semibold', darkMode ? 'text-gray-200' : 'text-gray-700']">Nilai Akhir (rata-rata aspek)</span>
            <span :class="['text-2xl font-bold tabular-nums', nilaiColor(formTotal)]">{{ formTotal }}</span>
          </div>

          <div class="mb-4">
            <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Keterangan <span :class="darkMode ? 'text-gray-500' : 'text-gray-400'">(opsional)</span></label>
            <textarea v-model="form.keterangan" rows="2" :class="['w-full px-3 py-2.5 border rounded-lg', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']"></textarea>
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
      <div :class="['w-full max-w-2xl mx-4 rounded-2xl', darkMode ? 'bg-gray-800 shadow-2xl' : 'light-modal']">
        <div :class="['flex items-center justify-between px-6 py-4 border-b', darkMode ? 'border-gray-700' : 'border-gray-200']">
          <h3 class="text-lg font-bold">Detail Penilaian</h3>
          <button @click="showDetail = false" :class="'w-8 h-8 rounded-lg flex items-center justify-center hover:' + (darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500')">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-6">
          <div class="mb-4">
            <div><span class="font-semibold">Siswa:</span> {{ detailItem?.siswa?.user?.nama }}</div>
            <div><span class="font-semibold">Pembimbing Industri:</span> {{ detailItem?.pembimbing_industri?.nama }}</div>
          </div>
          <table class="w-full text-sm">
            <tbody>
              <tr v-for="b in bobot" :key="b.key" :class="darkMode ? 'border-b border-gray-700' : 'border-b border-gray-100'">
                <td class="py-1.5">{{ b.nama }}</td>
                <td class="py-1.5 text-right font-semibold" :class="nilaiColor(detailItem?.[b.key])">{{ detailItem?.[b.key] }}</td>
              </tr>
              <tr class="mt-2">
                <td class="py-2 font-bold">Nilai Akhir</td>
                <td class="py-2 text-right font-bold text-lg" :class="nilaiColor(detailItem?.total)">{{ detailItem?.total }}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="detailItem?.keterangan" class="mt-3"><span class="font-semibold">Keterangan:</span> {{ detailItem.keterangan }}</div>
        </div>
      </div>
    </div>

    <!-- Cetak Modal -->
    <div v-if="showCetak" class="fixed inset-0 bg-black/50 flex items-center justify-center z-30" @click.self="showCetak = false">
      <div :class="['w-full max-w-2xl mx-4 rounded-2xl', darkMode ? 'bg-gray-800' : 'bg-white']">
        <div :class="['flex items-center justify-between px-6 py-4 border-b print:hidden', darkMode ? 'border-gray-700' : 'border-gray-200']">
          <h3 class="text-lg font-bold">Cetak Penilaian</h3>
          <div class="flex gap-2">
            <button @click="printCetak" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"><i class="fas fa-print mr-1"></i>Print</button>
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
          <table class="w-full text-sm mb-4">
            <tr><td class="py-1 font-semibold w-44">Nama Siswa</td><td>: {{ cetakItem?.siswa?.user?.nama }}</td></tr>
            <tr><td class="py-1 font-semibold">Pembimbing Industri</td><td>: {{ cetakItem?.pembimbing_industri?.nama }}</td></tr>
          </table>
          <table class="w-full text-sm border">
            <thead class="bg-gray-100">
              <tr>
                <th class="p-2 border text-left">Aspek</th>
                <th class="p-2 border text-center">Nilai</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="b in bobot" :key="b.key">
                <td class="p-2 border">{{ b.nama }}</td>
                <td class="p-2 border text-center font-bold" :class="nilaiColor(cetakItem?.[b.key])">{{ cetakItem?.[b.key] }}</td>
              </tr>
              <tr>
                <td class="p-2 border font-bold">Nilai Akhir (rata-rata)</td>
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
import DataTable from '../components/DataTable.vue'

const authStore = useAuthStore()
const themeStore = useThemeStore()
const notif = useNotificationStore()
const darkMode = computed(() => themeStore.darkMode)

const columns = [
  { key: "siswa.user.nama", label: "Siswa", sortable: true, searchable: true },
  { key: "disiplin", label: "Disiplin", align: "center", sortable: true, searchable: false, title: "Kehadiran, ketepatan waktu", class: (val) => nilaiColor(val) },
  { key: "tanggung_jawab", label: "Tanggung Jawab", align: "center", sortable: true, searchable: false, title: "Menyelesaikan tugas dengan baik", class: (val) => nilaiColor(val) },
  { key: "sikap_etika", label: "Sikap & Etika", align: "center", sortable: true, searchable: false, title: "Sopan santun, perilaku", class: (val) => nilaiColor(val) },
  { key: "kerja_sama", label: "Kerja Sama", align: "center", sortable: true, searchable: false, title: "Bekerja dalam tim", class: (val) => nilaiColor(val) },
  { key: "inisiatif", label: "Inisiatif", align: "center", sortable: true, searchable: false, title: "Proaktif, mau belajar", class: (val) => nilaiColor(val) },
  { key: "kualitas_hasil", label: "Kualitas Hasil", align: "center", sortable: true, searchable: false, title: "Ketelitian, kualitas", class: (val) => nilaiColor(val) },
  { key: "penguasaan", label: "Kompetensi", align: "center", sortable: true, searchable: false, title: "Kemampuan teknis", class: (val) => nilaiColor(val) },
  { key: "keselamatan_kerja", label: "K3", align: "center", sortable: true, searchable: false, title: "Prosedur keselamatan", class: (val) => nilaiColor(val) },
  { key: "total", label: "Total", align: "center", sortable: true, searchable: false, class: (val) => nilaiColor(val) },
];

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
  { key: 'disiplin', nama: 'Disiplin', bobot: 15 },
  { key: 'tanggung_jawab', nama: 'Tanggung Jawab', bobot: 15 },
  { key: 'sikap_etika', nama: 'Sikap & Etika Kerja', bobot: 15 },
  { key: 'kerja_sama', nama: 'Kerja Sama', bobot: 10 },
  { key: 'inisiatif', nama: 'Inisiatif', bobot: 10 },
  { key: 'kualitas_hasil', nama: 'Kualitas Hasil Kerja', bobot: 15 },
  { key: 'penguasaan', nama: 'Penguasaan Kompetensi', bobot: 15 },
  { key: 'keselamatan_kerja', nama: 'Keselamatan Kerja (K3)', bobot: 5 },
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
    notif.showMessage('Gagal memuat data', 'error')
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
    const ok = confirm('Apakah Anda yakin ingin menyelesaikan dan menyimpan penilaian ini?\n\nSetelah disimpan, siswa ini tidak dapat dinilai ulang.')
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

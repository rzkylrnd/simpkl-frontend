<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Data Siswa Binaan</h3>
    </div>
    <DataTable :items="data" :columns="columns" id-key="id_siswa" actions-header="Aksi" empty-text="Tidak ada siswa binaan">
      <template #actions="{ item }">
        <button @click="detail(item)" class="text-gray-600 hover:text-gray-800" title="Detail"><i class="fas fa-eye"></i></button>
      </template>
    </DataTable>

    <!-- Detail Modal -->
    <div v-if="showDetail" class="fixed inset-0 bg-black/50 flex items-center justify-center z-30" @click.self="showDetail = false">
      <div :class="['w-full max-w-lg mx-4 rounded-2xl shadow-2xl', darkMode ? 'bg-gray-800' : 'light-modal']">
        <div :class="['flex items-center justify-between px-6 py-4 border-b', darkMode ? 'border-gray-700' : 'border-gray-200']">
          <h3 class="text-lg font-bold">Detail Siswa Binaan</h3>
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
          <div><span class="font-semibold">Alamat Tempat PKL:</span> {{ detailItem?.penempatan?.tempat_pkl?.alamat || '-' }}</div>
          <div><span class="font-semibold">Pembimbing Industri:</span> {{ detailItem?.penempatan?.pembimbing_industri?.nama || '-' }}</div>
          <div><span class="font-semibold">Pembimbing Sekolah:</span> {{ detailItem?.penempatan?.pembimbing_sekolah?.nama || '-' }}</div>
          <div><span class="font-semibold">Periode PKL:</span> {{ detailItem?.penempatan ? (detailItem.penempatan.tanggal_mulai + ' s/d ' + detailItem.penempatan.tanggal_selesai) : '-' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useThemeStore } from '../stores/theme'
import { useNotificationStore } from '../stores/notification'
import axios from 'axios'
import DataTable from '../components/DataTable.vue'

const themeStore = useThemeStore()
const notif = useNotificationStore()
const darkMode = computed(() => themeStore.darkMode)

const columns = [
  { key: "user.nama", label: "Nama", sortable: true, searchable: true },
  { key: "nis", label: "NIS", sortable: true, searchable: true },
  { key: "sekolah.nama_sekolah", label: "Sekolah", sortable: true, searchable: true },
  { key: "kelas", label: "Kelas", sortable: true, searchable: true },
  { key: "jurusan", label: "Jurusan", sortable: true, searchable: true },
  { key: "penempatan.tempat_pkl.nama_perusahaan", label: "Tempat PKL", align: "left", sortable: true, searchable: true },
];

const data = ref([])
const loading = ref(false)
const showDetail = ref(false)
const detailItem = ref(null)

onMounted(() => { load() })

async function load() {
  loading.value = true
  try {
    const res = await axios.get('/api/siswa-binaan-list')
    data.value = res.data.data
  } catch (e) {
    notif.showMessage('Gagal memuat data', 'error')
  } finally {
    loading.value = false
  }
}

function detail(item) {
  detailItem.value = item
  showDetail.value = true
}
</script>
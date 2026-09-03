<template>
  <div>
    <div class="flex justify-between items-center mb-4 print-hide">
      <h3 class="text-lg font-semibold">Rekap Presensi Bulanan</h3>
      <button
        @click="windowPrint"
        :class="['px-4 py-2 rounded-lg font-medium text-white transition-all', darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'light-btn-primary']"
      >
        <i class="fas fa-print mr-1"></i>Cetak / Save as PDF
      </button>
    </div>

    <div class="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3 print-hide">
      <div>
        <label class="block text-sm mb-1">Tahun</label>
        <select v-model="tahun" :class="['w-full border px-3 py-2 rounded', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']">
          <option v-for="y in tahunList" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm mb-1">Bulan</label>
        <select v-model="bulan" :class="['w-full border px-3 py-2 rounded', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']">
          <option v-for="(m, i) in bulanList" :key="i" :value="i + 1">{{ m }}</option>
        </select>
      </div>
      <div class="flex items-end">
        <button
          @click="load"
          :class="['px-4 py-2 rounded-lg font-medium text-white transition-all w-full', darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'light-btn-primary']"
        >Tampilkan</button>
      </div>
    </div>

    <!-- Print Header -->
    <div class="print-only text-center mb-4">
      <h2 class="text-xl font-bold">REKAP PRESENSI SISWA PKL</h2>
      <p class="text-sm">Bulan: {{ bulanList[bulan - 1] }} {{ tahun }}</p>
      <hr class="my-2">
    </div>

    <div v-if="!loading && data.length === 0" class="p-6 text-center rounded-xl" :class="[darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500', 'shadow']">
      Tidak ada data presensi untuk periode ini
    </div>

    <div v-for="(siswa, idx) in data" :key="siswa.id_siswa"
      :class="['rounded-xl shadow mb-4 overflow-hidden', darkMode ? 'bg-gray-800 border border-gray-700' : 'light-card']">
      <div :class="['flex flex-wrap gap-x-6 gap-y-1 px-4 py-3 text-sm', darkMode ? 'bg-gray-700 text-gray-200' : 'light-table-header']">
        <span class="font-semibold">{{ idx + 1 }}. {{ siswa.nama }}</span>
        <span>NIS: {{ siswa.nis || '-' }}</span>
        <span v-if="siswa.kelas">Kelas: {{ siswa.kelas }}</span>
        <span v-if="siswa.jurusan">Jurusan: {{ siswa.jurusan }}</span>
        <span class="ml-auto font-bold">Total Hadir: {{ siswa.ringkasan.hadir }}</span>
      </div>
      <table class="w-full text-sm">
        <thead :class="darkMode ? 'bg-gray-700' : 'light-table-header'">
          <tr>
            <th class="p-3 text-left w-10">No</th>
            <th class="p-3 text-left">Tanggal</th>
            <th class="p-3 text-center">Jam Masuk</th>
            <th class="p-3 text-center">Jam Pulang</th>
            <th class="p-3 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(p, i) in siswa.presensi" :key="i"
            :class="[i % 2 === 0 ? (darkMode ? 'bg-gray-800' : 'bg-white') : (darkMode ? 'bg-gray-700' : 'bg-gray-50')]">
            <td class="p-3">{{ i + 1 }}</td>
            <td class="p-3">{{ p.tanggal }}</td>
            <td class="p-3 text-center">{{ p.waktu_datang ? p.waktu_datang.slice(0,5) + ' WIB' : '-' }}</td>
            <td class="p-3 text-center">{{ p.waktu_pulang ? p.waktu_pulang.slice(0,5) + ' WIB' : '-' }}</td>
            <td class="p-3 text-center">
              <span v-if="p.status_validasi === 'valid'" class="text-green-600 font-bold">Valid</span>
              <span v-else-if="p.status_validasi === 'tidak_valid'" class="text-red-600 font-bold">Tidak Valid</span>
              <span v-else class="text-yellow-600">Menunggu</span>
            </td>
          </tr>
          <tr v-if="!siswa.presensi.length">
            <td colspan="5" class="p-3 text-center" :class="darkMode ? 'text-gray-500' : 'text-gray-400'">Tidak ada presensi bulan ini</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="data.length" class="print-only mt-4 text-center text-xs">
      Dicetak pada: {{ todayStr }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useThemeStore } from "../stores/theme";
import { useNotificationStore } from "../stores/notification";
import axios from "axios";

const themeStore = useThemeStore();
const notif = useNotificationStore();
const darkMode = computed(() => themeStore.darkMode);

const bulanList = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

const now = new Date();
const todayStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
const bulan = ref(now.getMonth() + 1);
const tahun = ref(now.getFullYear());

const tahunList = computed(() => {
  const t = new Date().getFullYear();
  return [t - 1, t, t + 1];
});

const data = ref([]);
const loading = ref(false);

onMounted(load);

async function load() {
  loading.value = true;
  try {
    const res = await axios.get('/api/rekap-presensi', { params: { bulan: bulan.value, tahun: tahun.value } });
    data.value = res.data.data;
  } catch (e) {
    notif.showMessage('Gagal memuat rekap presensi', 'error');
  } finally {
    loading.value = false;
  }
}

function windowPrint() {
  window.print();
}
</script>

<style scoped>
@media print {
  body { background: white; }
  .print-hide { display: none !important; }
  .print-only { display: block !important; }
}
@media screen {
  .print-only { display: none !important; }
}
</style>

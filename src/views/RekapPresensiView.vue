<template>
  <div>
    <div class="flex justify-between items-center mb-4 print-hide">
      <h3 class="text-lg font-semibold">Lembar Presensi (Bulanan)</h3>
      <div class="flex items-center gap-3">
        <span
          v-if="rows.length"
          :class="['text-xs px-2.5 py-1 rounded-full font-medium', darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700']"
        >{{ selectedCount }} / {{ rows.length }} siswa</span>
        <button
          :disabled="!selectedCount"
          @click="windowPrint"
          :class="['px-4 py-2 rounded-lg font-medium text-white transition-all disabled:opacity-50', darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'light-btn-primary']"
        >
          <i class="fas fa-print mr-1"></i>Cetak / Save as PDF
        </button>
      </div>
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

    <div v-if="!loading && rows.length === 0" class="p-6 text-center rounded-xl" :class="[darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500', 'shadow print-hide']">
      Tidak ada data presensi untuk periode ini
    </div>

    <!-- Print Header -->
    <div class="print-only text-center mb-2">
      <h2 class="text-xl font-bold">LEMBAR PRESENSI SISWA PKL</h2>
      <p class="text-sm my-1">Bulan: {{ bulanList[bulan - 1] }} {{ tahun }}</p>
      <hr class="my-2">
    </div>

    <DataTable
      v-if="rows.length"
      :items="rows"
      :columns="columns"
      id-key="id_siswa"
      :selectable="true"
      :selected="selectedIds"
      @update:selected="selectedIds = $event"
      :paginate="false"
      :row-class="rowClass"
    />

    <div v-if="selectedCount" class="print-only mt-2 text-center text-[10px]">
      Sel diisi jam masuk/jam pulang. Dicetak pada: {{ todayStr }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useNotificationStore } from "../stores/notification";
import axios from "axios";
import DataTable from "../components/DataTable.vue";
const notif = useNotificationStore();
const darkMode = false;

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
const selectedIds = ref([]);

const days = computed(() => new Date(tahun.value, bulan.value, 0).getDate());

const rows = computed(() =>
  data.value.map((siswa) => {
    const byDay = {};
    (siswa.presensi || []).forEach((p) => {
      byDay[Number(p.tanggal.slice(8, 10))] = p;
    });
    return { ...siswa, byDay };
  })
);

const columns = computed(() => {
  const base = [
    { key: "nama", label: "Nama", sortable: true, searchable: true },
    { key: "kelas", label: "Kelas", sortable: true, searchable: true },
    { key: "jurusan", label: "Jurusan", sortable: true, searchable: true },
    { key: "sekolah", label: "Sekolah", sortable: true, searchable: true },
  ];
  const dayCols = [];
  for (let d = 1; d <= days.value; d++) {
    dayCols.push({
      key: "d" + d,
      label: String(d),
      align: "center",
      emptyText: "",
      value: (item) => cellText(item, d),
      cellClass: (item) => cellColor(item, d),
    });
  }
  return [
    ...base,
    ...dayCols,
    { key: "hadir", label: "Hadir", align: "center", sortable: true, value: (item) => item.ringkasan?.hadir ?? 0 },
  ];
});

const selectedCount = computed(() => selectedIds.value.length);

function rowClass(item) {
  return selectedIds.value.includes(item.id_siswa) ? "" : "opacity-40 print-exclude";
}

onMounted(load);

async function load() {
  loading.value = true;
  try {
    const res = await axios.get('/api/rekap-presensi', { params: { bulan: bulan.value, tahun: tahun.value } });
    data.value = res.data.data;
    selectedIds.value = data.value.map((s) => s.id_siswa);
  } catch (e) {
    notif.showMessage('Gagal memuat rekap presensi', 'error');
  } finally {
    loading.value = false;
  }
}

function cellText(item, day) {
  const rec = item.byDay[day];
  if (!rec) return '';
  const masuk = rec.waktu_datang ? rec.waktu_datang.slice(0, 5) : '';
  const pulang = rec.waktu_pulang ? rec.waktu_pulang.slice(0, 5) : '';
  if (!masuk && !pulang) return '';
  return masuk + '/' + pulang;
}

function cellColor(item, day) {
  const rec = item.byDay[day];
  return rec?.status_validasi === 'tidak_valid' ? 'text-red-500' : '';
}

function windowPrint() {
  window.print();
}
</script>

<style>
@media print {
  @page { size: A4 landscape; margin: 8mm; }
  body { background: white !important; }
  .print-hide { display: none !important; }
  .print-only { display: block !important; }
  .print-exclude { display: none !important; }
  .print-white { background: white !important; border-color: #ccc !important; box-shadow: none !important; }
  .print-white thead { background: white !important; }
  .print-white tbody tr { background: white !important; }
  .print-white table { font-size: 7px !important; }
  .print-white th, .print-white td { padding: 1px 2px !important; color: black !important; }
  .print-white th { border: 1px solid #000 !important; }
  .print-white td { border-bottom: 1px solid #ccc !important; }
}
@media screen {
  .print-only { display: none !important; }
}
</style>
<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Pengajuan Izin / Sakit</h3>
      <button
        v-if="authStore.isSiswa"
        @click="openForm"
        :class="['px-4 py-2 rounded-lg font-medium text-white transition-all', darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'light-btn-primary']"
      >Tambah</button>
    </div>

    <DataTable :items="data" :columns="columns" id-key="id_izin" actions-header="Aksi">
      <template #cell-jenis="{ item }">
        <span :class="['px-2 py-1 rounded text-xs font-bold', item.jenis === 'sakit' ? (darkMode ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700') : (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700')]">
          {{ item.jenis === 'sakit' ? 'Sakit' : 'Izin' }}
        </span>
      </template>
      <template #cell-keterangan="{ item }">
        <span class="max-w-xs block truncate" :title="item.keterangan">{{ item.keterangan || '-' }}</span>
      </template>
      <template #cell-file_path="{ item }">
        <a v-if="item.file_path" :href="item.file_url" target="_blank" class="text-blue-600 hover:underline"><i class="fas fa-file-pdf mr-1"></i>Lihat</a>
        <span v-else class="text-gray-400">-</span>
      </template>
      <template #cell-status_validasi="{ item }">
        <span v-if="item.status_validasi === 'valid'" class="inline-flex items-center bg-green-100 text-green-700 px-2.5 py-1 rounded-md text-xs font-bold">Diterima</span>
        <span v-else-if="item.status_validasi === 'tidak_valid'" class="inline-flex items-center bg-red-100 text-red-700 px-2.5 py-1 rounded-md text-xs font-bold">Ditolak</span>
        <span v-else class="inline-flex items-center bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-md text-xs">Menunggu</span>
      </template>
      <template #actions="{ item }">
        <template v-if="authStore.isPembimbingIndustri && item.status_validasi === 'menunggu'">
          <button @click="validasi(item.id_izin, 'valid')" class="bg-green-600 text-white px-2.5 py-1 rounded-md text-xs hover:bg-green-700 font-semibold mr-1">Terima</button>
          <button @click="validasi(item.id_izin, 'tidak_valid')" class="bg-red-500 text-white px-2.5 py-1 rounded-md text-xs hover:bg-red-600 font-semibold">Tolak</button>
        </template>
        <template v-else-if="authStore.isSiswa">
          <button @click="showDetail(item)" class="text-blue-600 hover:text-blue-800 mr-2" title="Lihat Detail"><i class="fas fa-eye"></i></button>
          <template v-if="item.status_validasi === 'menunggu'">
            <button @click="edit(item)" class="text-blue-600 hover:text-blue-800 mr-2" title="Edit"><i class="fas fa-edit"></i></button>
            <button @click="hapus(item.id_izin)" class="text-red-600 hover:text-red-800" title="Hapus"><i class="fas fa-trash-alt"></i></button>
          </template>
        </template>
        <template v-else-if="authStore.isAdmin">
          <button @click="showDetail(item)" class="text-blue-600 hover:text-blue-800" title="Lihat Detail"><i class="fas fa-eye"></i></button>
        </template>
        <template v-else-if="authStore.isPembimbingSekolah">
          <button @click="showDetail(item)" class="text-blue-600 hover:text-blue-800 mr-2" title="Lihat Detail"><i class="fas fa-eye"></i></button>
          <button v-if="item.status_validasi === 'menunggu' || item.status_validasi === 'valid'" @click="tolak(item.id_izin)" class="bg-red-500 text-white px-2.5 py-1 rounded-md text-xs hover:bg-red-600 font-semibold">
            {{ item.status_validasi === 'valid' ? 'Batalkan' : 'Tolak' }}
          </button>
        </template>
        <span v-else :class="['text-xs', darkMode ? 'text-gray-500' : 'text-gray-400']">-</span>
      </template>
    </DataTable>

    <!-- Form Modal -->
    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-30" @click.self="batal">
      <div :class="['p-6 rounded-xl shadow-lg w-full max-w-md', darkMode ? 'bg-gray-800' : 'light-modal']">
        <h3 class="text-lg font-bold mb-4">{{ form.id ? 'Edit' : 'Tambah' }} Pengajuan</h3>
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
            <input v-model="form.tanggal" type="date" required
              :readonly="authStore.isSiswa && !form.id"
              :class="['w-full border px-3 py-2 rounded', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input', (authStore.isSiswa && !form.id) ? 'opacity-70 cursor-not-allowed' : '']" />
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Jenis</label>
            <select v-model="form.jenis" required
              :class="['w-full border px-3 py-2 rounded', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']">
              <option value="izin">Izin</option>
              <option value="sakit">Sakit</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Keterangan</label>
            <textarea v-model="form.keterangan"
              placeholder="Jelaskan alasan izin/sakit..."
              :class="['w-full border px-3 py-2 rounded', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']"></textarea>
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Bukti (PDF / Foto)<span v-if="!form.id" class="text-red-500"> *</span></label>
            <input type="file" @change="onFileChange" accept=".pdf,.jpg,.jpeg,.png" :required="!form.id"
              :class="['w-full border px-3 py-2 rounded', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']" />
            <p v-if="form.file_name" class="text-xs mt-1" :class="darkMode ? 'text-gray-400' : 'text-gray-500'">File terpilih: {{ form.file_name }}</p>
            <p v-if="item?.file_path && !form.file_name" class="text-xs mt-1" :class="darkMode ? 'text-gray-400' : 'text-gray-500'">File saat ini ada. Upload baru untuk mengganti.</p>
          </div>
          <div class="flex gap-2 justify-end">
            <button type="button" @click="batal" :class="['px-4 py-2 border rounded', darkMode ? 'border-gray-600 hover:bg-gray-700' : 'light-btn-ghost text-gray-700']">Batal</button>
            <button type="submit" :disabled="loading" :class="['px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50', darkMode ? '' : 'shadow-sm']">
              <i v-if="loading" class="fas fa-spinner fa-spin mr-1"></i>{{ loading ? "Menyimpan..." : "Simpan" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="showDetailModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-30" @click.self="showDetailModal = false">
      <div :class="['p-6 rounded-xl shadow-lg w-full max-w-md', darkMode ? 'bg-gray-800' : 'light-modal']">
        <h3 class="text-lg font-bold mb-4">Detail Pengajuan</h3>
        <div class="space-y-2 text-md">
          <p><span class="font-semibold">Tanggal:</span> {{ detailItem?.tanggal }}</p>
          <p><span class="font-semibold">Jenis:</span> {{ detailItem?.jenis === 'sakit' ? 'Sakit' : 'Izin' }}</p>
          <p><span class="font-semibold">Keterangan:</span> {{ detailItem?.keterangan || '-' }}</p>
          <p><span class="font-semibold">Bukti:</span>
            <a v-if="detailItem?.file_path" :href="detailItem?.file_url" target="_blank" class="text-blue-600 hover:underline ml-1">
              <i class="fas fa-file-pdf"></i> Lihat Bukti
            </a>
            <span v-else class="text-gray-400 ml-1">Tidak ada</span>
          </p>
          <p><span class="font-semibold">Status:</span>
            <span v-if="detailItem?.status_validasi === 'valid'" class="text-green-600 font-bold ml-1">Diterima</span>
            <span v-else-if="detailItem?.status_validasi === 'tidak_valid'" class="text-red-600 font-bold ml-1">Ditolak</span>
            <span v-else class="text-yellow-600 ml-1">Menunggu</span>
          </p>
        </div>
        <div class="flex justify-end mt-4">
          <button @click="showDetailModal = false" :class="['px-4 py-2 border rounded', darkMode ? 'border-gray-600 hover:bg-gray-700' : 'light-btn-ghost text-gray-700']">Tutup</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useThemeStore } from "../stores/theme";
import { useAuthStore } from "../stores/auth";
import { useNotificationStore } from "../stores/notification";
import axios from "axios";
import DataTable from "../components/DataTable.vue";

const themeStore = useThemeStore();
const authStore = useAuthStore();
const notif = useNotificationStore();
const darkMode = ref(themeStore.darkMode);

const columns = [
  { key: "siswa.user.nama", label: "Siswa", sortable: true, searchable: true },
  { key: "tanggal", label: "Tanggal", sortable: true, searchable: true },
  { key: "jenis", label: "Jenis", align: "center", sortable: true, searchable: true },
  { key: "keterangan", label: "Keterangan", searchable: true },
  { key: "file_path", label: "Bukti", align: "center" },
  { key: "status_validasi", label: "Status", align: "center", sortable: true, searchable: true },
];

const data = ref([]);
const showForm = ref(false);
const showDetailModal = ref(false);
const loading = ref(false);
const detailItem = ref(null);
const item = ref(null);
const form = ref({
  id: null,
  id_siswa: "",
  tanggal: "",
  jenis: "izin",
  keterangan: "",
  file_name: "",
});
let formFile = null;

onMounted(() => { load(); });

async function load() {
  try {
    const res = await axios.get("/api/izin");
    data.value = res.data.data;
  } catch (e) {
    notif.showMessage("Gagal memuat data", "error");
  }
}

function batal() {
  showForm.value = false;
  formFile = null;
  item.value = null;
  form.value = { id: null, id_siswa: "", tanggal: "", jenis: "izin", keterangan: "", file_name: "" };
}

function openForm() {
  const today = new Date().toISOString().slice(0, 10);
  formFile = null;
  item.value = null;
  form.value = { id: null, id_siswa: authStore.user?.siswa?.id_siswa || "", tanggal: today, jenis: "izin", keterangan: "", file_name: "" };
  showForm.value = true;
}

function edit(dataItem) {
  formFile = null;
  item.value = dataItem;
  form.value = {
    id: dataItem.id_izin,
    id_siswa: dataItem.id_siswa,
    tanggal: dataItem.tanggal,
    jenis: dataItem.jenis,
    keterangan: dataItem.keterangan || "",
    file_name: "",
  };
  showForm.value = true;
}

function showDetail(dataItem) {
  detailItem.value = dataItem;
  showDetailModal.value = true;
}

function onFileChange(e) {
  const file = e.target.files[0];
  if (file) {
    formFile = file;
    form.value.file_name = file.name;
  }
}

async function simpan() {
  if (loading.value) return;
  if (!form.value.id && !formFile) {
    notif.showMessage("Bukti pendukung wajib diisi", "error");
    return;
  }
  loading.value = true;
  try {
    const payload = new FormData();
    payload.append("tanggal", form.value.tanggal);
    payload.append("jenis", form.value.jenis);
    if (form.value.keterangan) payload.append("keterangan", form.value.keterangan);
    if (formFile) payload.append("file_upload", formFile);

    if (form.value.id) {
      payload.append("_method", "PUT");
      await axios.post(`/api/izin/${form.value.id}`, payload);
    } else {
      await axios.post("/api/izin", payload);
    }
    batal();
    load();
    notif.showMessage("Pengajuan izin berhasil disimpan");
  } catch (e) {
    notif.showMessage(e.response?.data?.message || "Gagal menyimpan", "error");
  } finally {
    loading.value = false;
  }
}

async function validasi(id, status) {
  try {
    await axios.put(`/api/izin/${id}/validasi`, { status_validasi: status });
    load();
    notif.showMessage("Status pengajuan izin berhasil divalidasi");
  } catch (e) {
    notif.showMessage(e.response?.data?.message || "Gagal memvalidasi", "error");
  }
}

async function tolak(id) {
  if (!confirm("Yakin menolak/membatalkan pengajuan izin ini?")) return;
  try {
    await axios.put(`/api/izin/${id}/tolak`);
    load();
    notif.showMessage("Pengajuan izin ditolak/dibatalkan");
  } catch (e) {
    notif.showMessage(e.response?.data?.message || "Gagal", "error");
  }
}

async function hapus(id) {
  if (!confirm("Yakin hapus pengajuan izin ini?")) return;
  try {
    await axios.delete(`/api/izin/${id}`);
    load();
    notif.showMessage("Pengajuan izin berhasil dihapus");
  } catch (e) {
    notif.showMessage(e.response?.data?.message || "Gagal menghapus", "error");
  }
}
</script>

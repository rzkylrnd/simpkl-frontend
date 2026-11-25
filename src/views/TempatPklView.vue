<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Data Tempat PKL</h3>
      <button
        @click="
          batal();
          showForm = true;
        "
        :class="['px-4 py-2 rounded-lg font-medium text-white transition-all', darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'light-btn-primary']"
      >
        Tambah
      </button>
    </div>
    <DataTable :items="data" :columns="columns" id-key="id_tempat_pkl" actions-header="Aksi">
      <template #actions="{ item }">
        <button @click="edit(item)" class="text-blue-600 hover:text-blue-800 mr-2" title="Edit"><i class="fas fa-edit"></i></button>
        <button @click="hapus(item.id_tempat_pkl)" class="text-red-600 hover:text-red-800" title="Hapus"><i class="fas fa-trash-alt"></i></button>
      </template>
    </DataTable>

    <div
      v-if="showForm"
      class="fixed inset-0 bg-black/50 flex items-center justify-center"
    >
      <div
        :class="[
          'p-6 rounded-xl shadow-lg w-full max-w-md',
          darkMode ? 'bg-gray-800' : 'light-modal',
        ]"
      >
        <h3 class="text-lg font-bold mb-4">
          {{ form.id ? "Edit" : "Tambah" }} Tempat PKL
        </h3>
        <form @submit.prevent="simpan">
          <div class="mb-3">
            <label class="block text-sm mb-1">Nama Bidang</label>
            <input
              v-model="form.nama_perusahaan"
              type="text"
              required
              :class="[
                'w-full border px-3 py-2 rounded',
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input',
              ]"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm mb-1">Telp</label>
            <input
              v-model="form.telp"
              type="text"
              :class="[
                'w-full border px-3 py-2 rounded',
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input',
              ]"
            />
          </div>
          <div class="flex gap-2 justify-end">
            <button
              type="button"
              @click="batal"
              :class="[
                'px-4 py-2 border rounded',
                darkMode
                  ? 'border-gray-600 hover:bg-gray-700'
                  : 'light-btn-ghost text-gray-700',
              ]"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="loading"
              :class="['px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50', darkMode ? '' : 'shadow-sm']"
            >
              <i v-if="loading" class="fas fa-spinner fa-spin mr-1"></i
              >{{ loading ? "Menyimpan..." : "Simpan" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useNotificationStore } from "../stores/notification";
import DataTable from "../components/DataTable.vue";
import axios from "axios";
const notif = useNotificationStore();
const darkMode = false;

const columns = [
  { key: "nama_perusahaan", label: "Nama Bidang", sortable: true, searchable: true },
  { key: "telp", label: "Telp", sortable: true },
];

const loading = ref(false);
const data = ref([]);
const showForm = ref(false);
const form = ref({ id: null, nama_perusahaan: "", telp: "" });

onMounted(() => load());

async function load() {
  try {
    const res = await axios.get("/api/tempat-pkl");
    data.value = res.data.data;
  } catch (e) {
    notif.showMessage("Gagal memuat data", "error");
  }
}

function edit(item) {
  form.value = {
    id: item.id_tempat_pkl,
    nama_perusahaan: item.nama_perusahaan,
    telp: item.telp,
  };
  showForm.value = true;
}

function batal() {
  showForm.value = false;
  form.value = { id: null, nama_perusahaan: "", telp: "" };
}

async function simpan() {
  if (loading.value) return;
  loading.value = true;
  try {
    if (form.value.id) {
      await axios.put(`/api/tempat-pkl/${form.value.id}`, form.value);
    } else {
      await axios.post("/api/tempat-pkl", form.value);
    }
    batal();
    load();
    notif.showMessage("Tempat PKL berhasil disimpan");
  } catch (e) {
    notif.showMessage(e.response?.data?.message || "Gagal menyimpan", "error");
  } finally {
    loading.value = false;
  }
}

async function hapus(id) {
  if (!confirm("Yakin hapus?")) return;
  try {
    await axios.delete(`/api/tempat-pkl/${id}`);
    load();
    notif.showMessage("Tempat PKL berhasil dihapus");
  } catch (e) {
    notif.showMessage("Gagal menghapus", "error");
  }
}
</script>

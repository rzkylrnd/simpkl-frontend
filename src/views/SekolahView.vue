<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Data Sekolah</h3>
      <button
        @click="batal(); showForm = true"
        :class="['px-4 py-2 rounded-lg font-medium text-white transition-all', darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'light-btn-primary']"
      >
        Tambah
      </button>
    </div>
    <div
      :class="[
        'rounded-xl shadow overflow-x-auto',
        darkMode ? 'bg-gray-800 border border-gray-700' : 'light-card',
      ]"
    >
      <table class="w-full text-sm">
        <thead :class="darkMode ? 'bg-gray-700' : 'light-table-header'">
          <tr>
            <th class="p-3 text-left">Nama Sekolah</th>
            <th class="p-3 text-left">Alamat</th>
            <th class="p-3 text-left">Telp</th>
            <th class="p-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in data"
            :key="item.id_sekolah"
            :class="[
              i % 2 === 0 ? (darkMode ? 'bg-gray-800' : 'bg-white') : (darkMode ? 'bg-gray-700' : 'bg-gray-50'),
              darkMode ? 'hover:bg-gray-600 transition-colors' : 'light-table-row',
            ]"
          >
            <td class="p-3">{{ item.nama_sekolah }}</td>
            <td class="p-3">{{ item.alamat }}</td>
            <td class="p-3">{{ item.telp }}</td>
            <td class="p-3 text-center whitespace-nowrap">
              <button
                @click="edit(item)"
                class="text-blue-600 hover:text-blue-800 mr-2"
                title="Edit"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                @click="hapus(item.id_sekolah)"
                class="text-red-600 hover:text-red-800"
                title="Hapus"
              >
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

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
          {{ form.id ? "Edit" : "Tambah" }} Sekolah
        </h3>
        <form @submit.prevent="simpan">
          <div class="mb-3">
            <label class="block text-sm mb-1">Nama Sekolah</label>
            <input
              v-model="form.nama_sekolah"
              type="text"
              required
              :class="[
                'w-full border px-3 py-2 rounded',
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input',
              ]"
            />
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Alamat</label>
            <input
              v-model="form.alamat"
              type="text"
              required
              :class="['w-full border px-3 py-2 rounded', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm mb-1">Telp</label>
            <input
              v-model="form.telp"
              type="text"
              :class="['w-full border px-3 py-2 rounded', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']"
            />
          </div>
          <div class="flex gap-2 justify-end">
            <button
              type="button"
              @click="batal"
              :class="['px-4 py-2 border rounded', darkMode ? 'border-gray-600 hover:bg-gray-700' : 'light-btn-ghost text-gray-700']"
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
import { useThemeStore } from "../stores/theme";
import { useNotificationStore } from "../stores/notification";
import axios from "axios";

const themeStore = useThemeStore();
const notif = useNotificationStore();
const darkMode = computed(() => themeStore.darkMode);

const loading = ref(false);
const data = ref([]);
const showForm = ref(false);
const form = ref({ id: null, nama_sekolah: "", alamat: "", telp: "" });

onMounted(() => load());

async function load() {
  try {
    const res = await axios.get("/api/sekolah");
    data.value = res.data.data;
  } catch (e) {
    notif.showMessage("Gagal memuat data", "error");
  }
}

function edit(item) {
  form.value = {
    id: item.id_sekolah,
    nama_sekolah: item.nama_sekolah,
    alamat: item.alamat,
    telp: item.telp,
  };
  showForm.value = true;
}

function batal() {
  showForm.value = false;
  form.value = { id: null, nama_sekolah: "", alamat: "", telp: "" };
}

async function simpan() {
  if (loading.value) return;
  loading.value = true;
  try {
    if (form.value.id) {
      await axios.put(`/api/sekolah/${form.value.id}`, form.value);
    } else {
      await axios.post("/api/sekolah", form.value);
    }
    batal();
    load();
    notif.showMessage("Sekolah berhasil disimpan");
  } catch (e) {
    notif.showMessage(e.response?.data?.message || "Gagal menyimpan", "error");
  } finally {
    loading.value = false;
  }
}

async function hapus(id) {
  if (!confirm("Yakin hapus?")) return;
  try {
    await axios.delete(`/api/sekolah/${id}`);
    load();
    notif.showMessage("Sekolah berhasil dihapus");
  } catch (e) {
    notif.showMessage("Gagal menghapus", "error");
  }
}
</script>

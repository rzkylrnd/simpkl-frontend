<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Atur Jam Masuk &amp; Pulang</h3>
      <button
        @click="batal(); showForm = true"
        :class="['px-4 py-2 rounded-lg font-medium text-white transition-all', darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'light-btn-primary']"
      >Ubah Jam</button>
    </div>

    <div
      :class="['rounded-xl shadow overflow-x-auto', darkMode ? 'bg-gray-800 border border-gray-700' : 'light-card']"
    >
      <table class="w-full text-sm">
        <thead :class="darkMode ? 'bg-gray-700' : 'light-table-header'">
          <tr>
            <th class="p-3 text-left">Siswa</th>
            <th class="p-3 text-left">Tanggal</th>
            <th class="p-3 text-center">Jam Masuk</th>
            <th class="p-3 text-center">Jam Pulang</th>
            <th class="p-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in data"
            :key="item.id_presensi"
            :class="[
              i % 2 === 0 ? (darkMode ? 'bg-gray-800' : 'bg-white') : (darkMode ? 'bg-gray-700' : 'bg-gray-50'),
              darkMode ? 'hover:bg-gray-600 transition-colors' : 'light-table-row',
            ]"
          >
            <td class="p-3">{{ item.siswa?.user?.nama }}</td>
            <td class="p-3">{{ item.tanggal }}</td>
            <td class="p-3 text-center">
              <span :class="['inline-flex px-2 py-1 rounded text-xs font-bold', item.waktu_datang ? (darkMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-800') : '']">
                {{ item.waktu_datang ? item.waktu_datang.slice(0,5) : '-' }}
              </span>
            </td>
            <td class="p-3 text-center">
              <span :class="['inline-flex px-2 py-1 rounded text-xs font-bold', item.waktu_pulang ? (darkMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-800') : '']">
                {{ item.waktu_pulang ? item.waktu_pulang.slice(0,5) : '-' }}
              </span>
            </td>
            <td class="p-3 text-center whitespace-nowrap">
              <button
                @click="edit(item)"
                class="text-blue-600 hover:text-blue-800"
                title="Ubah Jam Masuk / Pulang"
              ><i class="fas fa-edit"></i> Ubah</button>
            </td>
          </tr>
          <tr v-if="!data.length">
            <td colspan="5" class="p-6 text-center" :class="darkMode ? 'text-gray-400' : 'text-gray-500'">Tidak ada data presensi</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-30" @click.self="batal">
      <div :class="['w-full max-w-md mx-4 rounded-2xl', darkMode ? 'bg-gray-800 shadow-2xl' : 'light-modal']">
        <div :class="['flex items-center justify-between px-6 py-4 border-b', darkMode ? 'border-gray-700' : 'border-gray-200']">
          <h3 class="text-lg font-bold">{{ form.id ? 'Ubah' : 'Tambah' }} Jam Presensi</h3>
          <button @click="batal" :class="'w-8 h-8 rounded-lg flex items-center justify-center hover:' + (darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500')">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <form @submit.prevent="simpan" class="p-6">
          <div class="mb-3">
            <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Siswa</label>
            <select v-if="!form.id" v-model="form.id_siswa" required :class="['w-full px-3 py-2.5 border rounded-lg', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']">
              <option value="">-- Pilih Siswa --</option>
              <option v-for="s in siswa" :key="s.id_siswa" :value="s.id_siswa">{{ s.user?.nama }}</option>
            </select>
            <input v-else :value="selectedSiswaNama" disabled :class="['w-full px-3 py-2.5 border rounded-lg', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 text-gray-500']" />
          </div>
          <div class="mb-3">
            <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Tanggal</label>
            <input v-model="form.tanggal" type="date" required :readonly="!!form.id" :class="['w-full px-3 py-2.5 border rounded-lg', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input', form.id ? 'opacity-70 cursor-not-allowed' : '']" />
          </div>
          <div class="mb-3">
            <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Jam Masuk</label>
            <input :value="form.waktu_datang" type="text" placeholder="HH:MM" pattern="^([01]\d|2[0-3]):([0-5]\d)$" @input="onTimeInput($event, 'waktu_datang')" :class="['w-full px-3 py-2.5 border rounded-lg', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']" />
          </div>
          <div class="mb-3">
            <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Jam Pulang</label>
            <input :value="form.waktu_pulang" type="text" placeholder="HH:MM" pattern="^([01]\d|2[0-3]):([0-5]\d)$" @input="onTimeInput($event, 'waktu_pulang')" :class="['w-full px-3 py-2.5 border rounded-lg', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']" />
          </div>
          <div class="flex gap-3 justify-end pt-4 border-t" :class="darkMode ? 'border-gray-700' : 'border-gray-200'">
            <button type="button" @click="batal" :class="['px-5 py-2.5 rounded-lg text-sm font-medium transition', darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'light-btn-ghost text-gray-700']">Batal</button>
            <button type="submit" :disabled="loading" :class="['px-5 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2', darkMode ? '' : 'shadow-sm']">
              <i v-if="loading" class="fas fa-spinner fa-spin"></i>{{ loading ? "Menyimpan..." : "Simpan" }}
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
import { useAuthStore } from "../stores/auth";
import axios from "axios";

const themeStore = useThemeStore();
const notif = useNotificationStore();
const authStore = useAuthStore();
const darkMode = computed(() => themeStore.darkMode);

const data = ref([]);
const siswa = ref([]);
const showForm = ref(false);
const loading = ref(false);
const form = ref({
  id: null,
  id_siswa: "",
  tanggal: "",
  waktu_datang: "",
  waktu_pulang: "",
});

const selectedSiswaNama = computed(() => {
  const s = siswa.value.find(x => x.id_siswa == form.value.id_siswa);
  return s?.user?.nama || "";
});

onMounted(() => { load(); loadSiswa(); });

async function load() {
  try {
    const res = await axios.get("/api/presensi");
    data.value = res.data.data;
  } catch (e) {
    notif.showMessage("Gagal memuat data", "error");
  }
}

async function loadSiswa() {
  try {
    const res = await axios.get("/api/siswa");
    siswa.value = res.data.data;
  } catch (e) {}
}

function edit(item) {
  form.value = {
    id: item.id_presensi,
    id_siswa: item.id_siswa,
    tanggal: item.tanggal,
    waktu_datang: (item.waktu_datang || "").replace(" WIB", ""),
    waktu_pulang: item.waktu_pulang || "",
  };
  showForm.value = true;
}

function batal() {
  showForm.value = false;
  form.value = { id: null, id_siswa: "", tanggal: "", waktu_datang: "", waktu_pulang: "" };
}

function onTimeInput(e, field) {
  const raw = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
  const formatted = raw.length >= 3 ? raw.slice(0, 2) + ":" + raw.slice(2) : raw;
  e.target.value = formatted;
  form.value[field] = formatted;
}

async function simpan() {
  if (loading.value) return;
  loading.value = true;
  try {
    const payload = {
      id_siswa: form.value.id_siswa,
      tanggal: form.value.tanggal,
    };
    if (form.value.waktu_datang) payload.waktu_datang = form.value.waktu_datang;
    if (form.value.waktu_pulang) payload.waktu_pulang = form.value.waktu_pulang;

    if (form.value.id) {
      const upd = {};
      if (payload.waktu_datang) upd.waktu_datang = payload.waktu_datang;
      if (payload.waktu_pulang) upd.waktu_pulang = payload.waktu_pulang;
      await axios.put(`/api/presensi/${form.value.id}`, upd);
    } else {
      if (!payload.tanggal) {
        notif.showMessage("Tanggal wajib diisi", "error");
        return;
      }
      await axios.post("/api/presensi", payload);
    }
    batal();
    load();
    notif.showMessage("Jam presensi berhasil disimpan");
  } catch (e) {
    notif.showMessage(e.response?.data?.message || "Gagal menyimpan", "error");
  } finally {
    loading.value = false;
  }
}
</script>

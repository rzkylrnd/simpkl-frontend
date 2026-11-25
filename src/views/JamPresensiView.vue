<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Atur Jam Masuk &amp; Pulang</h3>
      <button
        @click="openTambah"
        :class="['px-4 py-2 rounded-lg font-medium text-white transition-all', darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'light-btn-primary']"
      >Tambah Jam</button>
    </div>

    <div>
      <p class="mb-2 text-sm" :class="darkMode ? 'text-gray-400' : 'text-gray-500'">
        Jam masuk &amp; pulang berlaku untuk validasi saat siswa melakukan presensi pulang. Aturan tanggal khusus (misal pulang lebih cepat) akan menimpa jam default pada tanggal tersebut.
      </p>
    </div>

    <DataTable :items="data" :columns="columns" id-key="id_jam" actions-header="Aksi">
      <template #cell-tanggal="{ item }">
        <template v-if="item.tanggal">{{ item.tanggal }}</template>
        <span
          v-else
          :class="['inline-flex px-2 py-1 rounded text-xs font-bold', darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700']"
        >Default</span>
      </template>
      <template #cell-jam_masuk="{ item }">{{ item.jam_masuk ? item.jam_masuk.slice(0,5) : '-' }} WIB</template>
      <template #cell-jam_pulang="{ item }">{{ item.jam_pulang ? item.jam_pulang.slice(0,5) : '-' }} WIB</template>
      <template #actions="{ item }">
        <button
          @click="edit(item)"
          class="text-blue-600 hover:text-blue-800 mr-3"
          title="Ubah Jam"
        ><i class="fas fa-edit"></i></button>
        <button
          @click="hapus(item)"
          class="text-red-600 hover:text-red-800"
          title="Hapus"
        ><i class="fas fa-trash-alt"></i></button>
      </template>
    </DataTable>

    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-30" @click.self="batal">
      <div :class="['w-full max-w-md mx-4 rounded-2xl', darkMode ? 'bg-gray-800 shadow-2xl' : 'light-modal']">
        <div :class="['flex items-center justify-between px-6 py-4 border-b', darkMode ? 'border-gray-700' : 'border-gray-200']">
          <h3 class="text-lg font-bold">{{ form.id ? 'Ubah' : 'Tambah' }} Jam</h3>
          <button @click="batal" :class="'w-8 h-8 rounded-lg flex items-center justify-center hover:' + (darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500')">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <form @submit.prevent="simpan" class="p-6">
          <div class="mb-3">
            <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Tipe</label>
            <div class="flex gap-3">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="default" v-model="formTipe" :disabled="!!form.id" />
                <span>Default</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="tanggal" v-model="formTipe" :disabled="!!form.id" />
                <span>Tanggal Khusus</span>
              </label>
            </div>
          </div>
          <div v-if="formTipe === 'tanggal'" class="mb-3">
            <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Tanggal</label>
            <input v-model="form.tanggal" type="date" :readonly="!!form.id" required :class="['w-full px-3 py-2.5 border rounded-lg', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input', form.id ? 'opacity-70 cursor-not-allowed' : '']" />
          </div>
          <div class="mb-3">
            <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Jam Masuk</label>
            <input :value="form.jam_masuk" type="text" placeholder="HH:MM" pattern="^([01]\d|2[0-3]):([0-5]\d)$" @input="onTimeInput($event, 'jam_masuk')" :class="['w-full px-3 py-2.5 border rounded-lg', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']" />
          </div>
          <div class="mb-3">
            <label :class="['block text-sm font-medium mb-1.5', darkMode ? 'text-gray-300' : 'text-gray-700']">Jam Pulang</label>
            <input :value="form.jam_pulang" type="text" placeholder="HH:MM" pattern="^([01]\d|2[0-3]):([0-5]\d)$" @input="onTimeInput($event, 'jam_pulang')" :class="['w-full px-3 py-2.5 border rounded-lg', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']" />
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
import { useNotificationStore } from "../stores/notification";
import axios from "axios";
import DataTable from "../components/DataTable.vue";
const notif = useNotificationStore();
const darkMode = false;

const columns = [
  { key: "tanggal", label: "Tanggal", sortable: true, searchable: true },
  { key: "jam_masuk", label: "Jam Masuk", align: "center" },
  { key: "jam_pulang", label: "Jam Pulang", align: "center" },
];

const data = ref([]);
const showForm = ref(false);
const loading = ref(false);
const formTipe = ref("default");
const form = ref({
  id: null,
  tanggal: "",
  jam_masuk: "",
  jam_pulang: "",
});

onMounted(() => { load(); });

async function load() {
  try {
    const res = await axios.get("/api/jam-presensi");
    data.value = res.data.data;
  } catch (e) {
    notif.showMessage("Gagal memuat data", "error");
  }
}

function openTambah() {
  formTipe.value = "default";
  form.value = { id: null, tanggal: "", jam_masuk: "", jam_pulang: "" };
  showForm.value = true;
}

function edit(item) {
  formTipe.value = item.tanggal ? "tanggal" : "default";
  form.value = {
    id: item.id_jam,
    tanggal: item.tanggal || "",
    jam_masuk: item.jam_masuk ? item.jam_masuk.slice(0, 5) : "",
    jam_pulang: item.jam_pulang ? item.jam_pulang.slice(0, 5) : "",
  };
  showForm.value = true;
}

function batal() {
  showForm.value = false;
  form.value = { id: null, tanggal: "", jam_masuk: "", jam_pulang: "" };
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
      tanggal: formTipe.value === "tanggal" ? form.value.tanggal : null,
      jam_masuk: form.value.jam_masuk || null,
      jam_pulang: form.value.jam_pulang || null,
    };

    if (form.value.id) {
      await axios.put(`/api/jam-presensi/${form.value.id}`, payload);
    } else {
      await axios.post("/api/jam-presensi", payload);
    }
    batal();
    load();
    notif.showMessage("Pengaturan jam berhasil disimpan");
  } catch (e) {
    notif.showMessage(e.response?.data?.message || "Gagal menyimpan", "error");
  } finally {
    loading.value = false;
  }
}

async function hapus(item) {
  if (!confirm('Yakin hapus pengaturan jam ini?')) return;
  try {
    await axios.delete(`/api/jam-presensi/${item.id_jam}`);
    load();
    notif.showMessage("Pengaturan jam berhasil dihapus");
  } catch (e) {
    notif.showMessage(e.response?.data?.message || "Gagal menghapus", "error");
  }
}
</script>

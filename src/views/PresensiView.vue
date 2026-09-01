<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Attendance Data</h3>
      <button
        v-if="authStore.isSiswa"
        @click="openForm"
        :class="[
          'px-4 py-2 rounded-lg font-medium text-white transition-all',
          darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'light-btn-primary',
        ]"
      >
        Log Attendance
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
            <th class="p-3 text-left">Student</th>
            <th class="p-3 text-left">Date</th>
            <th class="p-3 text-left">Check In</th>
            <th class="p-3 text-left">Check Out</th>
            <th class="p-3 text-left">Status</th>
            <th class="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in data"
            :key="item.id_presensi"
            :class="[
              i % 2 === 0
                ? darkMode
                  ? 'bg-gray-800'
                  : 'bg-white'
                : darkMode
                  ? 'bg-gray-700'
                  : 'bg-gray-50',
              darkMode
                ? 'hover:bg-gray-600 transition-colors'
                : 'light-table-row',
            ]"
          >
            <td class="p-3">{{ item.siswa?.user?.nama }}</td>
            <td class="p-3">{{ item.tanggal }}</td>
            <td class="p-3">
              {{
                item.waktu_datang ? item.waktu_datang.slice(0, 5) + " WIB" : "-"
              }}
            </td>
            <td class="p-3">
              {{
                item.waktu_pulang ? item.waktu_pulang.slice(0, 5) + " WIB" : "-"
              }}
            </td>
            <td class="p-3">
              <span
                v-if="item.status_validasi === 'valid'"
                class="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold"
                >Valid</span
              >
              <span
                v-else-if="item.status_validasi === 'tidak_valid'"
                class="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold"
                >Not Valid</span
              >
              <span
                v-else
                class="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs"
                >Pending</span
              >
            </td>
            <td class="p-3 text-center whitespace-nowrap">
              <template
                v-if="
                  authStore.isPembimbingIndustri &&
                  item.status_validasi === 'menunggu'
                "
              >
                <button
                  @click="validasi(item.id_presensi, 'valid')"
                  class="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 mr-1"
                >
                  Valid
                </button>
                <button
                  @click="validasi(item.id_presensi, 'tidak_valid')"
                  class="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                >
                  Not Valid
                </button>
              </template>
              <template v-else-if="authStore.isSiswa || authStore.isAdmin">
                <button
                  @click="showDetail(item)"
                  class="text-blue-600 hover:text-blue-800"
                  title="View Detail"
                >
                  <i class="fas fa-eye"></i>
                </button>
              </template>
              <span
                v-else
                :class="[
                  'text-xs',
                  darkMode ? 'text-gray-500' : 'text-gray-400',
                ]"
                >-</span
              >
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
          {{
            form.id && !authStore.isSiswa
              ? "Edit"
              : presensiType
                ? "Attendance " + (presensiType === "masuk" ? "In" : "Out")
                : "Add"
          }}
          Attendance
        </h3>
        <form @submit.prevent="simpan">
          <div class="mb-3">
            <label class="block text-sm mb-1">Student</label>
            <p
              :class="[
                'text-sm font-medium py-2',
                darkMode ? 'text-gray-300' : 'text-gray-700',
              ]"
            >
              <i class="fas fa-user-graduate mr-1"></i
              >{{ authStore.user?.nama }}
            </p>
          </div>
          <input v-model="form.id_siswa" type="hidden" />
          <div class="mb-3">
            <label class="block text-sm mb-1">Date</label>
            <input
              v-model="form.tanggal"
              type="date"
              required
              :readonly="authStore.isSiswa && !form.id"
              :class="[
                'w-full border px-3 py-2 rounded',
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'light-input',
                authStore.isSiswa && !form.id
                  ? 'opacity-70 cursor-not-allowed'
                  : '',
              ]"
            />
          </div>
          <div
            v-if="authStore.isSiswa && presensiType === 'masuk' && !form.id"
            class="mb-3"
          >
            <label class="block text-sm mb-1">Arrival Time</label>
            <p
              :class="[
                'text-sm font-medium py-2',
                darkMode ? 'text-gray-300' : 'text-gray-700',
              ]"
            >
              <i class="fas fa-clock mr-1"></i>Will be filled automatically when saving
            </p>
          </div>
          <div
            v-else-if="authStore.isSiswa && presensiType === 'pulang'"
            class="mb-3"
          >
            <label class="block text-sm mb-1">Departure Time</label>
            <p
              :class="[
                'text-sm font-medium py-2',
                darkMode ? 'text-gray-300' : 'text-gray-700',
              ]"
            >
              <i class="fas fa-clock mr-1"></i>Will be filled automatically when saving
            </p>
          </div>
          <div v-else class="mb-3">
            <label class="block text-sm mb-1">Arrival Time</label>
            <input
              :value="form.waktu_datang"
              type="text"
              placeholder="HH:MM"
              pattern="^([01]\d|2[0-3]):([0-5]\d)$"
              @input="onTimeInput($event, 'waktu_datang')"
              :class="[
                'w-full border px-3 py-2 rounded',
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'light-input',
              ]"
            />
          </div>
          <div
            v-if="!authStore.isSiswa || (authStore.isSiswa && form.id)"
            class="mb-3"
          >
            <label class="block text-sm mb-1">Departure Time</label>
            <input
              :value="form.waktu_pulang"
              type="text"
              placeholder="HH:MM"
              pattern="^([01]\d|2[0-3]):([0-5]\d)$"
              @input="onTimeInput($event, 'waktu_pulang')"
              :class="[
                'w-full border px-3 py-2 rounded',
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'light-input',
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
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              :class="[
                'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50',
                darkMode ? '' : 'shadow-sm',
              ]"
            >
              <i v-if="loading" class="fas fa-spinner fa-spin mr-1"></i
              >{{ loading ? "Saving..." : "Save" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div
      v-if="showDetailModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center"
    >
      <div
        :class="[
          'p-6 rounded-xl shadow-lg w-full max-w-md',
          darkMode ? 'bg-gray-800' : 'light-modal',
        ]"
      >
        <h3 class="text-lg font-bold mb-4">Attendance Detail</h3>
        <div class="space-y-2 text-sm">
          <p>
            <span class="font-semibold">Date:</span>
            {{ detailItem?.tanggal }}
          </p>
          <p>
            <span class="font-semibold">Arrival Time:</span>
            {{
              detailItem?.waktu_datang
                ? detailItem.waktu_datang.slice(0, 5) + " WIB"
                : "-"
            }}
          </p>
          <p>
            <span class="font-semibold">Departure Time:</span>
            {{
              detailItem?.waktu_pulang
                ? detailItem.waktu_pulang.slice(0, 5) + " WIB"
                : "-"
            }}
          </p>
          <p>
            <span class="font-semibold">Status:</span>
            <span
              v-if="detailItem?.status_validasi === 'valid'"
              class="text-green-600 font-bold"
              >Valid</span
            >
            <span
              v-else-if="detailItem?.status_validasi === 'tidak_valid'"
              class="text-red-600 font-bold"
              >Not Valid</span
            >
            <span v-else class="text-yellow-600">Pending</span>
          </p>
        </div>
        <div class="flex justify-end mt-4">
          <button
            @click="showDetailModal = false"
            :class="[
              'px-4 py-2 border rounded',
              darkMode
                ? 'border-gray-600 hover:bg-gray-700'
                : 'light-btn-ghost text-gray-700',
            ]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useThemeStore } from "../stores/theme";
import { useAuthStore } from "../stores/auth";
import { useNotificationStore } from "../stores/notification";
import axios from "axios";

const authStore = useAuthStore();
const themeStore = useThemeStore();
const notif = useNotificationStore();
const darkMode = computed(() => themeStore.darkMode);

const data = ref([]);
const showForm = ref(false);
const showDetailModal = ref(false);
const detailItem = ref(null);
const loading = ref(false);
const presensiType = ref("");
const form = ref({
  id: null,
  id_siswa: "",
  tanggal: "",
  waktu_datang: "",
  waktu_pulang: "",
  catatan: "",
});

onMounted(() => {
  load();
});

async function load() {
  try {
    const res = await axios.get("/api/presensi");
    data.value = res.data.data;
  } catch (e) {
    notif.showMessage("Failed to load data", "error");
  }
}

async function getServerTime() {
  try {
    const res = await axios.get("/api/server-time");
    return res.data.time.slice(0, 5);
  } catch {
    return null;
  }
}

function isPulangAllowed(jam) {
  return jam !== null && jam !== undefined && jam >= "15:30";
}

async function openForm() {
  const today = new Date().toISOString().slice(0, 10);
  const todayRecord = data.value.find(
    (d) =>
      d.tanggal === today && d.id_siswa === authStore.user?.siswa?.id_siswa,
  );
  if (todayRecord && todayRecord.waktu_datang && todayRecord.waktu_pulang) {
    notif.showMessage(
      "You have already logged attendance in and out today",
      "warning",
    );
    return;
  }
  if (todayRecord && todayRecord.waktu_datang) {
    const jamServer = await getServerTime();
    if (!isPulangAllowed(jamServer)) {
      notif.showMessage(
        "You cannot log check out yet. Minimum 15:30 WIB.",
        "warning",
      );
      return;
    }
    presensiType.value = "pulang";
    form.value = {
      id: todayRecord.id_presensi,
      id_siswa: todayRecord.id_siswa,
      tanggal: today,
      waktu_datang: "",
      waktu_pulang: "",
      catatan: "",
    };
  } else {
    presensiType.value = "masuk";
    form.value = {
      id: null,
      id_siswa: authStore.user?.siswa?.id_siswa || "",
      tanggal: today,
      waktu_datang: "",
      waktu_pulang: "",
      catatan: "",
    };
  }
  showForm.value = true;
}

function showDetail(item) {
  detailItem.value = item;
  showDetailModal.value = true;
}

function edit(item) {
  form.value = {
    id: item.id_presensi,
    id_siswa: item.id_siswa,
    tanggal: item.tanggal,
    waktu_datang: (item.waktu_datang || "").replace(" WIB", ""),
    waktu_pulang: item.waktu_pulang || "",
    catatan: item.catatan || "",
  };
  showForm.value = true;
}

function onTimeInput(e, field) {
  const raw = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
  const formatted =
    raw.length >= 3 ? raw.slice(0, 2) + ":" + raw.slice(2) : raw;
  e.target.value = formatted;
  form.value[field] = formatted;
}

function batal() {
  showForm.value = false;
  form.value = {
    id: null,
    id_siswa: "",
    tanggal: "",
    waktu_datang: "",
    waktu_pulang: "",
    catatan: "",
  };
}

async function simpan() {
  if (loading.value) return;
  loading.value = true;
  try {
    const now = new Date().toTimeString().slice(0, 5);
    if (authStore.isSiswa) {
      if (presensiType.value === "masuk") {
        const payload = {
          id_siswa: authStore.user?.siswa?.id_siswa,
          tanggal: form.value.tanggal,
          waktu_datang: now,
        };
        await axios.post("/api/presensi", payload);
      } else if (presensiType.value === "pulang") {
        const jamServer = await getServerTime();
        if (!isPulangAllowed(jamServer)) {
          notif.showMessage(
            "You cannot log check out yet. Minimum 15:30 WIB.",
            "warning",
          );
          return;
        }
        await axios.put(`/api/presensi/${form.value.id}`, {
          waktu_pulang: now,
        });
      }
    } else {
      const payload = { ...form.value };
      if (!payload.waktu_datang) delete payload.waktu_datang;
      if (!payload.waktu_pulang) delete payload.waktu_pulang;
      if (form.value.id) {
        await axios.put(`/api/presensi/${form.value.id}`, payload);
      } else {
        await axios.post("/api/presensi", payload);
      }
    }
    batal();
    load();
    notif.showMessage("Attendance saved successfully");
  } catch (e) {
    const msg = e.response?.data?.message || "";
    if (msg.includes("Duplicate entry")) {
      notif.showMessage("You have already logged attendance today", "warning");
    } else {
      notif.showMessage(msg || "Failed to save", "error");
    }
  } finally {
    loading.value = false;
  }
}

async function validasi(id, status) {
  try {
    await axios.put(`/api/presensi/${id}/validasi`, {
      status_validasi: status,
    });
    load();
    notif.showMessage("Attendance status validated successfully");
  } catch (e) {
    notif.showMessage("Failed to validate", "error");
  }
}

async function hapus(id) {
  if (confirm("Are you sure you want to delete?")) {
    try {
      await axios.delete(`/api/presensi/${id}`);
      load();
      notif.showMessage("Attendance deleted successfully");
    } catch (e) {
      notif.showMessage("Failed to delete", "error");
    }
  }
}
</script>

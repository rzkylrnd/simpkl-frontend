<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Student Data</h3>
    </div>
    <div :class="['rounded-xl shadow overflow-x-auto', darkMode ? 'bg-gray-800 border border-gray-700' : 'light-card']">
      <table class="w-full text-sm">
        <thead :class="darkMode ? 'bg-gray-700' : 'light-table-header'">
          <tr>
            <th class="p-3 text-left">Name</th>
            <th class="p-3 text-left">NIS</th>
            <th class="p-3 text-left">School</th>
            <th class="p-3 text-left">Class</th>
            <th class="p-3 text-left">Major</th>
            <th class="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in data" :key="item.id_siswa" :class="[i % 2 === 0 ? (darkMode ? 'bg-gray-800' : 'bg-white') : (darkMode ? 'bg-gray-700' : 'bg-gray-50'), darkMode ? 'hover:bg-gray-600 transition-colors' : 'light-table-row']">
            <td class="p-3">{{ item.user?.nama }}</td>
            <td class="p-3">{{ item.nis }}</td>
            <td class="p-3">{{ item.sekolah?.nama_sekolah }}</td>
            <td class="p-3">{{ item.kelas }}</td>
            <td class="p-3">{{ item.jurusan }}</td>
            <td class="p-3 text-center">
              <button @click="detail(item)" class="text-gray-600 hover:text-gray-800" title="Detail"><i class="fas fa-eye"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Detail Modal -->
    <div v-if="showDetail" class="fixed inset-0 bg-black/50 flex items-center justify-center z-30" @click.self="showDetail = false">
      <div :class="['w-full max-w-lg mx-4 rounded-2xl shadow-2xl', darkMode ? 'bg-gray-800' : 'light-modal']">
        <div :class="['flex items-center justify-between px-6 py-4 border-b', darkMode ? 'border-gray-700' : 'border-gray-200']">
          <h3 class="text-lg font-bold">Student Detail</h3>
          <button @click="showDetail = false" :class="'w-8 h-8 rounded-lg flex items-center justify-center hover:' + (darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500')">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-6 space-y-3">
          <div><span class="font-semibold">Name:</span> {{ detailItem?.user?.nama }}</div>
          <div><span class="font-semibold">Email:</span> {{ detailItem?.user?.email }}</div>
          <div><span class="font-semibold">NIS:</span> {{ detailItem?.nis }}</div>
          <div><span class="font-semibold">School:</span> {{ detailItem?.sekolah?.nama_sekolah }}</div>
          <div><span class="font-semibold">Class:</span> {{ detailItem?.kelas }}</div>
          <div><span class="font-semibold">Major:</span> {{ detailItem?.jurusan }}</div>
          <div><span class="font-semibold">Address:</span> {{ detailItem?.alamat || '-' }}</div>
          <div><span class="font-semibold">Phone:</span> {{ detailItem?.telp || '-' }}</div>
          <div><span class="font-semibold">Field:</span> {{ detailItem?.penempatan?.tempat_pkl?.nama_perusahaan || '-' }}</div>
          <div><span class="font-semibold">Industry Supervisor:</span> {{ detailItem?.penempatan?.pembimbing_industri?.nama || '-' }}</div>
          <div><span class="font-semibold">Supervising Teacher:</span> {{ detailItem?.penempatan?.guru_pembimbing?.nama || '-' }}</div>
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

const themeStore = useThemeStore()
const notif = useNotificationStore()
const darkMode = computed(() => themeStore.darkMode)

const data = ref([])
const showDetail = ref(false)
const detailItem = ref(null)

onMounted(() => { load() })

async function load() {
  try {
    const res = await axios.get('/api/siswa')
    data.value = res.data.data
  } catch (e) {
    notif.showMessage('Failed to load data', 'error')
  }
}

function detail(item) {
  detailItem.value = item
  showDetail.value = true
}
</script>

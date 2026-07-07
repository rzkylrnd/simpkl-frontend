<template>
  <div class="max-w-lg mx-auto">
    <div :class="['rounded shadow p-6', darkMode ? 'bg-gray-800' : 'bg-white']">
      <h3 class="text-lg font-bold mb-4">Profile</h3>
      <div class="space-y-2 mb-4">
        <p><span class="font-semibold">Nama:</span> {{ authStore.user?.nama }}</p>
        <p><span class="font-semibold">Email:</span> {{ authStore.user?.email }}</p>
        <p><span class="font-semibold">Role:</span> {{ authStore.user?.role }}</p>
      </div>

      <div class="flex gap-2 mb-4">
        <button @click="showEdit = !showEdit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Edit Profile</button>
        <button @click="showPassword = !showPassword" class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Ganti Password</button>
      </div>

      <div v-if="showEdit" :class="['rounded shadow p-4 mb-4', darkMode ? 'bg-gray-700' : 'bg-gray-50']">
        <form @submit.prevent="updateProfile">
          <h4 class="font-semibold mb-3">Edit Profile</h4>
          <div class="mb-3">
            <label class="block text-sm mb-1">Nama</label>
            <input v-model="editForm.nama" type="text" required :class="['w-full border px-3 py-2 rounded', darkMode ? 'bg-gray-700 border-gray-600 text-white' : '']" />
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Email</label>
            <input v-model="editForm.email" type="email" required :class="['w-full border px-3 py-2 rounded', darkMode ? 'bg-gray-700 border-gray-600 text-white' : '']" />
          </div>
          <div v-if="authStore.isSiswa" class="mb-3">
            <label class="block text-sm mb-1">Sekolah</label>
            <select v-model="editForm.id_sekolah" required :class="['w-full border px-3 py-2 rounded', darkMode ? 'bg-gray-700 border-gray-600 text-white' : '']">
              <option value="">-- Pilih --</option>
              <option v-for="s in sekolah" :key="s.id_sekolah" :value="s.id_sekolah">{{ s.nama_sekolah }}</option>
            </select>
          </div>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Simpan</button>
        </form>
      </div>
      <div v-if="showPassword" :class="['rounded shadow p-4', darkMode ? 'bg-gray-700' : 'bg-gray-50']">
        <form @submit.prevent="changePassword">
          <h4 class="font-semibold mb-3">Ganti Password</h4>
          <div class="mb-3">
            <label class="block text-sm mb-1">Password Baru</label>
            <input v-model="passwordForm.password" type="password" required minlength="6" :class="['w-full border px-3 py-2 rounded', darkMode ? 'bg-gray-700 border-gray-600 text-white' : '']" />
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Konfirmasi Password</label>
            <input v-model="passwordForm.password_confirmation" type="password" required minlength="6" :class="['w-full border px-3 py-2 rounded', darkMode ? 'bg-gray-700 border-gray-600 text-white' : '']" />
          </div>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Simpan</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import axios from 'axios'

const authStore = useAuthStore()
const themeStore = useThemeStore()
const darkMode = computed(() => themeStore.darkMode)
const showEdit = ref(false)
const showPassword = ref(false)
const editForm = ref({ nama: authStore.user?.nama || '', email: authStore.user?.email || '', id_sekolah: authStore.user?.siswa?.id_sekolah || '' })
const sekolah = ref([])
const passwordForm = ref({ password: '', password_confirmation: '' })

async function loadSekolah() {
  try {
    const res = await axios.get('/api/sekolah')
    sekolah.value = res.data.data
  } catch (e) {}
}

onMounted(() => {
  editForm.value.nama = authStore.user?.nama || ''
  editForm.value.email = authStore.user?.email || ''
  editForm.value.id_sekolah = authStore.user?.siswa?.id_sekolah || ''
  loadSekolah()
})

async function updateProfile() {
  const payload = {
    nama: editForm.value.nama,
    email: editForm.value.email,
    role: authStore.user.role,
  }
  await axios.put(`/api/users/${authStore.user.id}`, payload)
  if (authStore.isSiswa && editForm.value.id_sekolah) {
    await axios.put(`/api/siswa/${authStore.user.siswa.id_siswa}`, {
      id_sekolah: editForm.value.id_sekolah,
      nis: authStore.user.siswa.nis,
      kelas: authStore.user.siswa.kelas,
      jurusan: authStore.user.siswa.jurusan,
    })
  }
  await authStore.fetchUser()
  showEdit.value = false
}

async function changePassword() {
  if (passwordForm.value.password !== passwordForm.value.password_confirmation) {
    alert('Konfirmasi password tidak cocok')
    return
  }
  await axios.put(`/api/users/${authStore.user.id}`, {
    nama: authStore.user.nama,
    email: authStore.user.email,
    role: authStore.user.role,
    password: passwordForm.value.password,
  })
  passwordForm.value = { password: '', password_confirmation: '' }
  showPassword.value = false
  alert('Password berhasil diubah')
}
</script>

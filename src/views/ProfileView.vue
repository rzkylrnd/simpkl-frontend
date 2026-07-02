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

      <form v-if="showEdit" @submit.prevent="updateProfile" :class="['border-t pt-4 mb-4', darkMode ? 'border-gray-600' : '']">
        <h4 class="font-semibold mb-2">Edit Profile</h4>
        <div class="mb-3">
          <label class="block text-sm mb-1">Nama</label>
          <input v-model="editForm.nama" type="text" required :class="['w-full border px-3 py-2 rounded', darkMode ? 'bg-gray-700 border-gray-600 text-white' : '']" />
        </div>
        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Simpan</button>
      </form>

      <form v-if="showPassword" @submit.prevent="changePassword" :class="['border-t pt-4', darkMode ? 'border-gray-600' : '']">
        <h4 class="font-semibold mb-2">Ganti Password</h4>
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
const editForm = ref({ nama: authStore.user?.nama || '' })
const passwordForm = ref({ password: '', password_confirmation: '' })

onMounted(() => {
  editForm.value.nama = authStore.user?.nama || ''
})

async function updateProfile() {
  await axios.put(`/api/users/${authStore.user.id}`, {
    nama: editForm.value.nama,
    email: authStore.user.email,
    role: authStore.user.role,
  })
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

import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token'),
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
    isSiswa: (state) => state.user?.role === 'siswa',
    isPembimbingSekolah: (state) => state.user?.role === 'pembimbing_sekolah',
    isPembimbingIndustri: (state) => state.user?.role === 'pembimbing_industri',
  },
  actions: {
    async login(email, password) {
      const res = await axios.post('/api/login', { email, password })
      this.token = res.data.token
      this.user = res.data.user
      localStorage.setItem('token', res.data.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
      return res.data
    },
    async fetchUser() {
      if (!this.token) return
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      const res = await axios.get('/api/me')
      this.user = res.data.user
    },
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    },
  },
})

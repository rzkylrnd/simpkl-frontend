import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    darkMode: localStorage.getItem('darkMode') === 'true',
  }),
  actions: {
    toggle() {
      this.darkMode = !this.darkMode
      localStorage.setItem('darkMode', this.darkMode)
    },
  },
})

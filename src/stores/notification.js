import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    show: false,
    message: '',
    type: 'success',
  }),
  actions: {
    showMessage(msg, type = 'success') {
      this.message = msg
      this.type = type
      this.show = true
      setTimeout(() => { this.show = false }, 3000)
    },
  },
})

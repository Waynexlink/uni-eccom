import { create } from 'zustand'
import api from '@/lib/axios'

interface User {
  _id: string
  name: string
  email: string
  role?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  fetchUser: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  fetchUser: async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        set({ user: null, isAuthenticated: false, loading: false })
        return
      }

      const { data } = await api.get('/me')

      set({
        user: data.user,
        isAuthenticated: true,
        loading: false,
      })

    } catch {
      localStorage.removeItem('token')
      set({ user: null, isAuthenticated: false, loading: false })
    }
  },

  logout: async () => {
    await api.get('/logout')
    localStorage.removeItem('token')
    set({
      user: null,
      isAuthenticated: false,
    })
  },
}))

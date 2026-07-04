import { create } from 'zustand'
import type { AuthUser, Company } from '@/types'
import { APP_CONFIG } from '@/config'
import { storage } from '@/utils'

interface AuthState {
  user: AuthUser | null
  company: Company | null
  isAuthenticated: boolean
  isLoading: boolean

  setAuth: (user: AuthUser, company: Company, tokens: { access_token: string; refresh_token: string }) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  updateUser: (user: Partial<AuthUser>) => void
  updateCompany: (company: Partial<Company>) => void
  hydrate: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  company: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user, company, tokens) => {
    storage.set(APP_CONFIG.TOKEN_KEY, tokens.access_token)
    storage.set(APP_CONFIG.REFRESH_TOKEN_KEY, tokens.refresh_token)
    storage.set(APP_CONFIG.USER_KEY, user)
    storage.set(APP_CONFIG.COMPANY_KEY, company)
    set({ user, company, isAuthenticated: true, isLoading: false })
  },

  logout: () => {
    storage.remove(APP_CONFIG.TOKEN_KEY)
    storage.remove(APP_CONFIG.REFRESH_TOKEN_KEY)
    storage.remove(APP_CONFIG.USER_KEY)
    storage.remove(APP_CONFIG.COMPANY_KEY)
    set({ user: null, company: null, isAuthenticated: false, isLoading: false })
  },

  setLoading: (loading) => set({ isLoading: loading }),

  updateUser: (data) => {
    const current = get().user
    if (current) {
      const updated = { ...current, ...data }
      storage.set(APP_CONFIG.USER_KEY, updated)
      set({ user: updated })
    }
  },

  updateCompany: (data) => {
    const current = get().company
    if (current) {
      const updated = { ...current, ...data }
      storage.set(APP_CONFIG.COMPANY_KEY, updated)
      set({ company: updated })
    }
  },

  hydrate: () => {
    const user = storage.get<AuthUser>(APP_CONFIG.USER_KEY)
    const company = storage.get<Company>(APP_CONFIG.COMPANY_KEY)
    const token = storage.get<string>(APP_CONFIG.TOKEN_KEY)
    if (user && company && token) {
      set({ user, company, isAuthenticated: true, isLoading: false })
    } else {
      set({ isLoading: false })
    }
  },
}))

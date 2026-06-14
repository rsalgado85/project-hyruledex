/**
 * Global State Store (Zustand)
 * 
 * Persisted state includes favorites, history, and preferences.
 * Favorites now support multiple entity types (character, boss, creature).
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/* ─── Types ─────────────────────────────────────────── */

export type FavoriteType = 'character' | 'boss' | 'creature';

export interface FavoriteEntry {
  type: FavoriteType;
  id: number;
}

interface AppState {
  // Favorites — typed entries (also accepts legacy single-id calls with default 'creature')
  favorites: FavoriteEntry[];
  addFavorite: (typeOrId: FavoriteType | number, id?: number) => void;
  removeFavorite: (typeOrId: FavoriteType | number, id?: number) => void;
  isFavorite: (typeOrId: FavoriteType | number, id?: number) => boolean;
  toggleFavorite: (type: FavoriteType, id: number) => void;

  // History
  history: number[];
  addToHistory: (id: number) => void;
  clearHistory: () => void;

  // Preferences
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Language
  language: 'en' | 'es';
  setLanguage: (lang: 'en' | 'es') => void;
  toggleLanguage: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

/* ─── Helpers ───────────────────────────────────────── */

function favKey(type: FavoriteType, id: number): string {
  return `${type}:${id}`;
}

/** Check if two entries are equal */
function isSameEntry(a: FavoriteEntry, b: FavoriteEntry): boolean {
  return a.type === b.type && a.id === b.id;
}

/** Migration: old number[] → new FavoriteEntry[] (assumed 'creature' type) */
function migrateFavorites(data: unknown): FavoriteEntry[] {
  if (!Array.isArray(data)) return [];
  if (data.length === 0) return [];
  // Check first item — if it's a number, migrate
  if (typeof data[0] === 'number') {
    return (data as number[]).map((id) => ({ type: 'creature' as const, id }));
  }
  return data as FavoriteEntry[];
}

/* ─── Store ─────────────────────────────────────────── */

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Favorites
      favorites: [],

      addFavorite: (typeOrId, id?) => {
        const type: FavoriteType = (typeof typeOrId === 'string' ? typeOrId : 'creature') as FavoriteType;
        const entityId: number = (typeof typeOrId === 'number' ? typeOrId : id) as number;
        set((state) => {
          const entry: FavoriteEntry = { type, id: entityId };
          if (state.favorites.some((f) => isSameEntry(f, entry))) return state;
          return { favorites: [...state.favorites, entry] };
        });
      },

      removeFavorite: (typeOrId, id?) => {
        const type: FavoriteType = (typeof typeOrId === 'string' ? typeOrId : 'creature') as FavoriteType;
        const entityId: number = (typeof typeOrId === 'number' ? typeOrId : id) as number;
        set((state) => ({
          favorites: state.favorites.filter(
            (f) => !(f.type === type && f.id === entityId)
          ),
        }));
      },

      isFavorite: (typeOrId, id?) => {
        const type: FavoriteType = (typeof typeOrId === 'string' ? typeOrId : 'creature') as FavoriteType;
        const entityId: number = (typeof typeOrId === 'number' ? typeOrId : id) as number;
        return get().favorites.some((f) => f.type === type && f.id === entityId);
      },

      toggleFavorite: (type, id) => {
        const state = get();
        if (state.favorites.some((f) => f.type === type && f.id === id)) {
          state.removeFavorite(type, id);
        } else {
          state.addFavorite(type, id);
        }
      },

      // History
      history: [],
      addToHistory: (id) =>
        set((state) => ({
          history: [id, ...state.history.filter((hid) => hid !== id)].slice(0, 50),
        })),
      clearHistory: () => set({ history: [] }),

      // Preferences
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      sidebarCollapsed: false,
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      // Language
      language: 'es',
      setLanguage: (language) => set({ language }),
      toggleLanguage: () => set((state) => ({ language: state.language === 'en' ? 'es' : 'en' })),

      // Search
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: 'hyruledex-store',
      partialize: (state) => ({
        favorites: state.favorites,
        history: state.history,
        theme: state.theme,
        language: state.language,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
      // Migrate old number[] favorites on load
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.favorites = migrateFavorites(state.favorites);
        }
      },
    }
  )
);

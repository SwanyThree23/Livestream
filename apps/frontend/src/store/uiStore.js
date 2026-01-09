import { create } from 'zustand';

/**
 * UI Store - Manages UI state
 */
export const useUIStore = create((set) => ({
  sidebarOpen: true,
  theme: localStorage.getItem('theme') || 'light',

  /**
   * Toggle sidebar
   */
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  /**
   * Set sidebar state
   */
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  /**
   * Set theme
   */
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
}));

// src/app/hooks/useSidebar.ts
'use client';

import { create } from 'zustand';

interface SidebarState {
  isCollapsed: boolean;   // untuk desktop (icon only)
  isOpen: boolean;        // untuk mobile (drawer terbuka/tutup)
  toggleCollapsed: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useSidebar = create<SidebarState>((set) => ({
  isCollapsed: false,
  isOpen: false,

  toggleCollapsed: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
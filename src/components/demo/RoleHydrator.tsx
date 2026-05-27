'use client'

import { useEffect } from 'react'
import type { WaitlistRole } from '@/types'

const ROLE_STORAGE_KEY = 'altr_demo_role'

// Mounts on a page that strongly implies a role (e.g. /brands → 'brand',
// /live-ip → 'live-ip'). Sets the role if none is stored yet so that
// downstream demo screens (/confirm, /contract, /rail) gate their UI to
// the correct side. Never overrides an existing role — if the user is
// already signed in or already mid-flow, their explicit choice wins.
export function RoleHydrator({ role }: { role: WaitlistRole }) {
  useEffect(() => {
    try {
      const existing = window.localStorage.getItem(ROLE_STORAGE_KEY)
      if (existing === 'brand' || existing === 'live-ip') return
      window.localStorage.setItem(ROLE_STORAGE_KEY, role)
    } catch {
      /* quota / private mode — ignore */
    }
  }, [role])
  return null
}

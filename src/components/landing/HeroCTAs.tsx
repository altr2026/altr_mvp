'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ConnectPanel } from '@/components/auth/ConnectPanel'
import { Modal } from '@/components/ui/Modal'
import type { WaitlistRole } from '@/types'

const ROLE_STORAGE_KEY = 'altr_demo_role'

export function HeroCTAs() {
  const router = useRouter()
  const [signInOpen, setSignInOpen] = useState(false)

  const enterDemoAs = (role: WaitlistRole, route: string) => {
    try {
      window.localStorage.setItem(ROLE_STORAGE_KEY, role)
    } catch {
      /* quota / private mode — ignore */
    }
    router.push(route)
  }

  return (
    <>
      <div className="mt-12 flex flex-wrap items-center gap-3 md:mt-14">
        <button
          type="button"
          onClick={() => setSignInOpen(true)}
          className="rounded-lg bg-altr-mint px-6 py-3 text-[13px] font-semibold text-altr-white transition hover:bg-altr-mint-bright"
        >
          Browse ALTR Free →
        </button>
        <Link
          href="#waitlist"
          className="rounded-lg border border-altr-mint-bright/30 bg-altr-mint/[0.08] px-6 py-3 text-[13px] font-semibold text-altr-mint-bright transition hover:border-altr-mint hover:bg-altr-mint/[0.16]"
        >
          Secure your spot
        </Link>
      </div>

      <div className="mt-3 flex flex-col items-start gap-1.5">
        <button
          type="button"
          onClick={() => enterDemoAs('brand', '/brands')}
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-altr-text-2 transition hover:text-altr-lime"
        >
          Browse Demo as a brand →
        </button>
        <button
          type="button"
          onClick={() => enterDemoAs('live-ip', '/live-ip')}
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-altr-text-2 transition hover:text-altr-lime"
        >
          Browse Demo as a rightholder →
        </button>
      </div>

      <Modal open={signInOpen} onClose={() => setSignInOpen(false)}>
        <ConnectPanel />
      </Modal>
    </>
  )
}

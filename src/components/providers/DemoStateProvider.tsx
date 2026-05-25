'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  type BrandProfile,
  type MatchResult,
  DEFAULT_BRAND,
  loadDemoState,
  saveDemoState,
} from '@/lib/demo-state'

type DemoState = {
  brand: BrandProfile
  selectedMatchId: MatchResult['id'] | null
  matches: MatchResult[] | null
  matchedAt: string | null
}

type DemoContextValue = {
  state: DemoState
  hydrated: boolean
  selectedMatch: MatchResult | null
  setBrand: (b: BrandProfile) => void
  setMatches: (m: MatchResult[]) => void
  selectMatch: (id: MatchResult['id']) => void
  reset: () => void
}

const DEFAULT_STATE: DemoState = {
  brand: DEFAULT_BRAND,
  selectedMatchId: null,
  matches: null,
  matchedAt: null,
}

const DemoStateContext = createContext<DemoContextValue | null>(null)

export function DemoStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState>(DEFAULT_STATE)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setState(loadDemoState())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    saveDemoState(state)
  }, [state, hydrated])

  const setBrand = useCallback(
    (brand: BrandProfile) =>
      setState((s) => ({ ...s, brand, matches: null, selectedMatchId: null })),
    [],
  )

  const setMatches = useCallback(
    (matches: MatchResult[]) => setState((s) => ({ ...s, matches })),
    [],
  )

  const selectMatch = useCallback(
    (id: MatchResult['id']) =>
      setState((s) => ({
        ...s,
        selectedMatchId: id,
        matchedAt: new Date().toISOString(),
      })),
    [],
  )

  const reset = useCallback(() => setState(DEFAULT_STATE), [])

  const value = useMemo<DemoContextValue>(
    () => ({
      state,
      hydrated,
      selectedMatch:
        state.matches?.find((m) => m.id === state.selectedMatchId) ?? null,
      setBrand,
      setMatches,
      selectMatch,
      reset,
    }),
    [state, hydrated, setBrand, setMatches, selectMatch, reset],
  )

  return (
    <DemoStateContext.Provider value={value}>
      {children}
    </DemoStateContext.Provider>
  )
}

export function useDemoState(): DemoContextValue {
  const ctx = useContext(DemoStateContext)
  if (!ctx)
    throw new Error('useDemoState must be used inside DemoStateProvider')
  return ctx
}

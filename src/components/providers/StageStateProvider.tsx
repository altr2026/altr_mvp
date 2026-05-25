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
  type StageProfile,
  type StageScreening,
  DEFAULT_STAGE,
  loadStageState,
  saveStageState,
} from '@/lib/stage-state'

type StageState = {
  stage: StageProfile
  screening: StageScreening | null
  submittedAt: string | null
}

type StageContextValue = {
  state: StageState
  hydrated: boolean
  setStage: (s: StageProfile) => void
  setScreening: (s: StageScreening) => void
  reset: () => void
}

const DEFAULT_STATE: StageState = {
  stage: DEFAULT_STAGE,
  screening: null,
  submittedAt: null,
}

const StageStateContext = createContext<StageContextValue | null>(null)

export function StageStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StageState>(DEFAULT_STATE)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setState(loadStageState())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    saveStageState(state)
  }, [state, hydrated])

  const setStage = useCallback(
    (stage: StageProfile) =>
      setState((s) => ({ ...s, stage, screening: null })),
    [],
  )

  const setScreening = useCallback(
    (screening: StageScreening) =>
      setState((s) => ({
        ...s,
        screening,
        submittedAt: new Date().toISOString(),
      })),
    [],
  )

  const reset = useCallback(() => setState(DEFAULT_STATE), [])

  const value = useMemo<StageContextValue>(
    () => ({ state, hydrated, setStage, setScreening, reset }),
    [state, hydrated, setStage, setScreening, reset],
  )

  return (
    <StageStateContext.Provider value={value}>
      {children}
    </StageStateContext.Provider>
  )
}

export function useStageState(): StageContextValue {
  const ctx = useContext(StageStateContext)
  if (!ctx)
    throw new Error('useStageState must be used inside StageStateProvider')
  return ctx
}

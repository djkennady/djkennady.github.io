export type Tier = 'high' | 'mid' | 'low'

export type TierEnv = {
  webgl2: boolean
  cores: number
  memory?: number
  coarsePointer: boolean
  reducedMotion: boolean
}

export type TierSettings = { dpr: [number, number]; segments: number; render3d: boolean }

const SETTINGS: Record<Tier, TierSettings> = {
  high: { dpr: [1, 1.75], segments: 128, render3d: true },
  mid: { dpr: [1, 1.25], segments: 64, render3d: true },
  low: { dpr: [1, 1], segments: 0, render3d: false },
}

/** Уровень устройства определяется один раз при загрузке. Решение здесь —
 *  это обещание никогда не греть слабый телефон живым рендером. */
export function detectTier(env: TierEnv): Tier {
  if (env.reducedMotion) return 'low'
  if (!env.webgl2) return 'low'
  if (env.cores < 4) return 'low'
  if (env.memory !== undefined && env.memory < 4) return 'low'
  if (env.cores >= 8 && !env.coarsePointer) return 'high'
  return 'mid'
}

export function tierSettings(tier: Tier): TierSettings {
  return SETTINGS[tier]
}

function hasWebgl2(): boolean {
  try {
    return Boolean(document.createElement('canvas').getContext('webgl2'))
  } catch {
    return false
  }
}

export function readEnv(): TierEnv {
  const nav = navigator as Navigator & { deviceMemory?: number }
  return {
    webgl2: hasWebgl2(),
    cores: nav.hardwareConcurrency ?? 2,
    memory: nav.deviceMemory,
    coarsePointer: window.matchMedia('(pointer: coarse)').matches,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  }
}

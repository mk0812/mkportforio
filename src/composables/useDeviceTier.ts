import { onMounted, ref, type Ref } from 'vue'
import { prefersReducedMotion } from '@/composables/usePrefersReducedMotion'

export type DeviceTierLevel = 'high' | 'medium' | 'low'

export interface DeviceTier {
  tier: DeviceTierLevel
  saveData: boolean
  reducedMotion: boolean
}

interface NetworkInformationLike {
  saveData?: boolean
}

interface NavigatorWithHints extends Navigator {
  deviceMemory?: number
  connection?: NetworkInformationLike
}

const SSR_FALLBACK: DeviceTier = {
  tier: 'low',
  saveData: false,
  reducedMotion: false,
}

function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

function getSaveData(): boolean {
  if (typeof navigator === 'undefined') return false
  const conn = (navigator as NavigatorWithHints).connection
  return conn?.saveData === true
}

export function detectDeviceTier(): DeviceTier {
  if (typeof window === 'undefined') return SSR_FALLBACK

  const reducedMotion = prefersReducedMotion()
  const saveData = getSaveData()

  if (reducedMotion || saveData) {
    return { tier: 'low', saveData, reducedMotion }
  }

  const cores = navigator.hardwareConcurrency ?? 4
  const memory = (navigator as NavigatorWithHints).deviceMemory
  const touch = isTouchDevice()

  if (cores >= 8 && (memory === undefined || memory >= 8) && !touch) {
    return { tier: 'high', saveData, reducedMotion }
  }

  if (cores >= 4) {
    return { tier: 'medium', saveData, reducedMotion }
  }

  return { tier: 'low', saveData, reducedMotion }
}

export function useDeviceTier(): Ref<DeviceTier> {
  const deviceTier = ref<DeviceTier>(SSR_FALLBACK)

  onMounted(() => {
    deviceTier.value = detectDeviceTier()
  })

  return deviceTier
}

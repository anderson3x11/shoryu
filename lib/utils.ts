import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// useSyncExternalStore subscribe for values that never change after hydration (mounted flag,
// a localStorage read): there is nothing to listen to.
export const noSubscribe = () => () => {}

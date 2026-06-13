"use client"

import { useSyncExternalStore } from "react"
import { getSnapshot, getServerSnapshot, subscribe, type ConsentState } from "@/lib/consent"

/** Devuelve el estado de consentimiento y se re-renderiza cuando cambia. */
export function useConsent(): ConsentState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

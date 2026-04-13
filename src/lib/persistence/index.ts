"use client"

import { createLocalRepository } from "@/lib/persistence/local-repo"
import { createSupabaseRepository } from "@/lib/persistence/supabase-repo"
import type { PersistenceRepository } from "@/lib/persistence/types"

let cachedRepo: Promise<PersistenceRepository> | null = null
const REPOSITORY_INIT_TIMEOUT_MS = 3000

function createFallbackRepository() {
  return createLocalRepository()
}

export function getRepository(): Promise<PersistenceRepository> {
  if (!cachedRepo) {
    cachedRepo = (async () => {
      try {
        return await Promise.race<PersistenceRepository>([
          (async () => {
            const supabaseRepo = await createSupabaseRepository()
            return supabaseRepo ?? createFallbackRepository()
          })(),
          new Promise<PersistenceRepository>((resolve) => {
            setTimeout(() => resolve(createFallbackRepository()), REPOSITORY_INIT_TIMEOUT_MS)
          }),
        ])
      } catch {
        return createFallbackRepository()
      }
    })()
  }

  return cachedRepo
}

'use client'

import { SessionProvider } from "next-auth/react"
import { UserSessionManager } from "./UserSessionManager"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UserSessionManager />
      {children}
    </SessionProvider>
  )
}

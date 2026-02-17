'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'

export default function FetchUserProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { fetchUser } = useAuthStore()

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return <>{children}</>
}

'use client'

import { usePathname } from 'next/navigation'
import { Navigation } from './Navigation'
import UnifiedKanchenAcademy from '@/components/UnifiedKanchenAcademy'

export function ClientLayoutProvider({ children }) {
  const pathname = usePathname()
  
  // Don't use UnifiedKanchenAcademy for home page
  if (pathname === '/') {
    return <>{children}</>
  }
  
  return (
    <UnifiedKanchenAcademy>
      {children}
    </UnifiedKanchenAcademy>
  )
}

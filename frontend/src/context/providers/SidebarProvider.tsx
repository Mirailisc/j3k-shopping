import { ReactNode, useEffect, useState } from 'react'
import { SidebarContext } from '../SidebarContext'
import { SIDEBAR_EXPAND } from '@/constants/local-storage'

type Props = {
  children: ReactNode
}

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }: Props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const isSidebarExpand = localStorage.getItem(SIDEBAR_EXPAND)

  useEffect(() => {
    if (isSidebarExpand) {
      setIsSidebarOpen(isSidebarExpand === 'true')
    } else {
      localStorage.setItem(SIDEBAR_EXPAND, 'false')
    }
  }, [isSidebarExpand])

  const toggleSidebar = () => {
    localStorage.setItem(SIDEBAR_EXPAND, String(!isSidebarOpen))
    setIsSidebarOpen((prev) => !prev)
  }

  return <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>{children}</SidebarContext.Provider>
}

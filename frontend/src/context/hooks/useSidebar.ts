import { useContext } from 'react'
import { SidebarContext } from '../SidebarContext'

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  return context
}

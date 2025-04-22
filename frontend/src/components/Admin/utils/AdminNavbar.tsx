import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../../ui/button'
import Command from './Command'
import { useSidebar } from '@/context/hooks/useSidebar'
import AvatarDropdown from '../../utils/AvatarDropdown'
import { Link } from 'react-router-dom'
import { BASE_PATH } from '@/constants/routes'
import { Badge } from '@/components/ui/badge'

const AdminNavbar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false)
  const sidebar = useSidebar()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <div className="sticky top-[10px] border border-black/20 dark:border-white/10 mx-[10px] z-40 bg-zinc-100/50 dark:bg-zinc-900/50 backdrop-blur-lg rounded-sm shadow-md">
      <div className="flex flex-row  items-center justify-between px-6 py-3">
        <div className="flex items-center flex-row gap-4">
          <Button variant="outline" className="cursor-pointer" size="icon" onClick={() => sidebar?.toggleSidebar()}>
            {sidebar?.isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </Button>
          <Link to={BASE_PATH}>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold">T</span>
              </div>
              <span className="hidden md:block text-xl font-bold">TUN9</span>
              {import.meta.env.DEV && <Badge variant="destructive">dev</Badge>}
            </div>
          </Link>
        </div>
        <div className="flex gap-4">
          <Button
            size="sm"
            variant="outline"
            className="text-zinc-500 hidden lg:block"
            onClick={() => setOpen((prev) => !prev)}
          >
            Search....{' '}
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
          <AvatarDropdown />
        </div>
      </div>
      <Command open={open} setOpen={setOpen} />
    </div>
  )
}

export default AdminNavbar

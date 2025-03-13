import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../../ui/button'
import Command from './Command'
import { useSidebar } from '@/context/hooks/useSidebar'
import AvatarDropdown from './AvatarDropdown'

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
    <div className="sticky top-[10px] border border-white/10 mx-[10px] z-40 bg-zinc-900 backdrop-blur-lg rounded-sm shadow-md">
      <div className="flex flex-row  items-center justify-between px-6 py-3">
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="cursor-pointer bg-zinc-900"
            size="icon"
            onClick={() => sidebar?.toggleSidebar()}
          >
            {sidebar?.isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </Button>
          <h1 className="text-2xl font-bold">J3K</h1>
        </div>
        <div className="flex gap-4">
          <Button
            size="sm"
            variant="outline"
            className="bg-zinc-900 text-zinc-500 hidden lg:block"
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

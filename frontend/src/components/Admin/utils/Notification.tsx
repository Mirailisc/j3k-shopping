import { useEffect, useState } from 'react'
import { Bell, Check } from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { axiosInstance } from '@/lib/axios'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

type Notification = {
  id: string
  userId: string
  message: string
  isRead: boolean
  createdAt: Date
}

const Notification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get('/notification')
      setNotifications(response.data)
    } catch {
      toast.error('Unable to fetch notifications')
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await axiosInstance.patch(`/notification/${id}`)
      fetchNotifications()
    } catch {
      toast.error('Unable to mark notification as read')
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative">
        <Button size="icon" variant="outline">
          <Bell />
        </Button>
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            {notifications.length}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <DropdownMenuItem disabled>No notifications</DropdownMenuItem>
        ) : (
          notifications.map((n) => (
            <DropdownMenuItem
              key={n.id}
              className="flex justify-between items-center gap-2 hover:bg-transparent focus:bg-transparent"
            >
              <div className="text-sm">{n.message}</div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      markAsRead(n.id)
                    }}
                  >
                    <Check />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mark as read</p>
                </TooltipContent>
              </Tooltip>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Notification

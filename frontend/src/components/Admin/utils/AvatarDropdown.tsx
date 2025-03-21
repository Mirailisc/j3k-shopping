import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { ACCESS_TOKEN } from '@/constants/cookie'
import { BASE_PATH, PROFILE_PATH } from '@/constants/routes'
import { logout } from '@/store/slice/authSlice'
import { RootState, useAppDispatch } from '@/store/store'
import { ChevronDown, Github, LucideLogOut } from 'lucide-react'
import { useCookies } from 'react-cookie'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

const AvatarDropdown: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useSelector((state: RootState) => state.auth.user)
  const [, , removeCookie] = useCookies([ACCESS_TOKEN])

  const handleSignOut = () => {
    dispatch(logout())
    removeCookie(ACCESS_TOKEN)
    navigate(BASE_PATH, { replace: true })
  }

  if (!user)
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-6 w-[100px]" />
      </div>
    )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="cursor-pointer" size="sm">
            <Avatar>
              <AvatarImage
                width={32}
                height={32}
                className="rounded-full"
                src={`https://github.com/${user.username}.png`}
                alt={`@${user.username}`}
              />
              <AvatarFallback>{user.firstName[0] + user.lastName[0]}</AvatarFallback>
            </Avatar>
            {user.username}
            <ChevronDown className="ml-auto" />
          </Button>
        </DropdownMenuTrigger>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <Link to={PROFILE_PATH}>
          {user.firstName && user.lastName ? (
            <DropdownMenuItem>
              {user.firstName} {user.lastName}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem>{user.username}</DropdownMenuItem>
          )}
        </Link>
        <DropdownMenuSeparator />
        <a href="https://github.com/Mirailisc/j3k-shopping-fe" target="_blank" rel="noreferrer">
          <DropdownMenuItem>
            <Github /> GitHub
          </DropdownMenuItem>
        </a>
        <a href="https://youtu.be/dQw4w9WgXcQ">
          <DropdownMenuItem>Support</DropdownMenuItem>
        </a>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleSignOut()}>
          <LucideLogOut /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AvatarDropdown

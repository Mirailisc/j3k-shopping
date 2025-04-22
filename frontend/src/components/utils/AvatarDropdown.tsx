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
import {
  ADMIN_DASHBOARD_PATH,
  BASE_PATH,
  BILLING_PATH,
  ORDER_PATH,
  PRODUCT_PATH,
  PROFILE_PATH,
  SELLER_DASHBOARD_PATH,
} from '@/constants/routes'
import { logout } from '@/store/slice/authSlice'
import { RootState, useAppDispatch } from '@/store/store'
import {
  ChevronDown,
  Github,
  HomeIcon,
  LayoutDashboard,
  LucideLogOut,
  Package,
  Receipt,
  ShoppingBag,
} from 'lucide-react'
import { useCookies } from 'react-cookie'
import Gravatar from 'react-gravatar'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import ThemeToggleButton from './ThemeToggleButton'

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
            <Gravatar email={user.email} size={32} className="rounded-full" />
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
        <div className="block md:hidden">
          <Link to={BASE_PATH}>
            <DropdownMenuItem>
              <Button className="w-full">Sell Something</Button>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <Link to={BASE_PATH}>
            <DropdownMenuItem>
              <HomeIcon />
              Home
            </DropdownMenuItem>
          </Link>
          <Link to={PRODUCT_PATH}>
            <DropdownMenuItem>
              <ShoppingBag />
              Products
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
        </div>
        <Link to={ORDER_PATH}>
          <DropdownMenuItem>
            <Package />
            Orders
          </DropdownMenuItem>
        </Link>
        <Link to={BILLING_PATH}>
          <DropdownMenuItem>
            <Receipt />
            Billing
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        {user.isAdmin || user.isSuperAdmin ? (
          <Link to={ADMIN_DASHBOARD_PATH}>
            <DropdownMenuItem>
              <LayoutDashboard />
              Admin Dashboard
            </DropdownMenuItem>
          </Link>
        ) : null}
        <Link to={SELLER_DASHBOARD_PATH}>
          <DropdownMenuItem>
            <LayoutDashboard />
            Seller Dashboard
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <a href="https://github.com/Mirailisc/j3k-shopping" target="_blank" rel="noreferrer">
          <DropdownMenuItem>
            <Github /> GitHub
          </DropdownMenuItem>
        </a>
        <a href="https://youtu.be/dQw4w9WgXcQ">
          <DropdownMenuItem>Support</DropdownMenuItem>
        </a>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <ThemeToggleButton />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleSignOut()}>
          <LucideLogOut /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AvatarDropdown

import { Button } from '@/components/ui/button'
import AvatarDropdown from '@/components/utils/AvatarDropdown'
import { BASE_PATH, PRODUCT_PATH, SIGN_IN_PATH } from '@/constants/routes'
import { RootState } from '@/store/store'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import ProductSearchInput from './ProductSearchInput'
import { HomeIcon, LogIn, ShoppingBag } from 'lucide-react'

const Navbar: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  return (
    <div className="fixed top-[10px] left-[10px] right-[10px] border border-white/10 z-40 bg-zinc-900 backdrop-blur-lg rounded-sm shadow-md mx-0">
      <div className="flex flex-row items-center justify-between px-6 py-3">
        <div className="flex gap-4 items-center">
          <Link to={BASE_PATH}>
            <h1 className="text-2xl font-bold">J3K</h1>
          </Link>
          <div className="gap-4 items-center hidden md:flex">
            <Link to={BASE_PATH} className="flex gap-1 items-center text-sm text-zinc-500 hover:text-zinc-200">
              <HomeIcon size={16} /> Home
            </Link>
            <Link to={PRODUCT_PATH} className="flex gap-1 items-center text-sm text-zinc-500 hover:text-zinc-200">
              <ShoppingBag size={16} /> Products
            </Link>
            <a href="https://youtu.be/OFhMGhvW_5I" className="flex gap-1 items-center text-sm text-zinc-500 hover:text-zinc-200">
              Free Robux
            </a>
          </div>
        </div>
        <ProductSearchInput />
        <div className="flex gap-4">
          {isAuthenticated && <Button className="hidden md:block">Sell Something</Button>}
          {isAuthenticated ? (
            <AvatarDropdown />
          ) : (
            <Link to={SIGN_IN_PATH}>
              <Button variant="default">
                <LogIn />
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar

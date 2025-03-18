import React, { Suspense, useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
  ADMIN_BASE_PATH,
  BASE_PATH,
  DASHBOARD_PATH,
  ORDER_ITEM_MANAGE_PATH,
  ORDER_MANAGE_PATH,
  PRODUCT_MANAGE_PATH,
  PROFILE_PATH,
  REPORT_PATH,
  REVIEW_MANAGE_PATH,
  SIGN_IN_PATH,
  SIGN_UP_PATH,
  USER_MANAGE_PATH,
} from '@/constants/routes'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import AdminNavbar from './components/Admin/utils/AdminNavbar'
import Dashboard from './pages/Admin/Dashboard'
import { SidebarProvider } from './context/providers/SidebarProvider'
import Report from './pages/Admin/Report'
import User from './pages/Admin/User'
import Product from './pages/Admin/Products'
import OrderItem from './pages/Admin/OrderItem'
import Order from './pages/Admin/Order'
import Review from './pages/Admin/Review'
import { toast, Toaster } from 'sonner'
import { TooltipProvider } from './components/ui/tooltip'
import AdminProtected from './components/utils/AdminProtected'
import { useAppDispatch } from './store/store'
import { ACCESS_TOKEN } from './constants/cookie'
import { useCookies } from 'react-cookie'
import { me } from './store/slice/authSlice'
import Loading from './pages/Loading'
import Profile from './pages/User/Profile/Profile'

const Home = React.lazy(() => import('@/pages/Home'))

function App() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const [cookie, , removeCookie] = useCookies([ACCESS_TOKEN])

  const navbarRender = () => {
    if (location.pathname.includes(ADMIN_BASE_PATH)) {
      return <AdminNavbar />
    }
  }

  useEffect(() => {
    if (cookie[ACCESS_TOKEN]) {
      try {
        dispatch(me(cookie[ACCESS_TOKEN]))
      } catch (error) {
        toast.error(error as string)
        removeCookie(ACCESS_TOKEN)
        navigate(SIGN_IN_PATH, { replace: true })
      }
    }
  }, [cookie, dispatch, removeCookie, navigate])

  return (
    <TooltipProvider>
      <SidebarProvider>
        <Suspense fallback={<Loading />}>
          <Toaster />
          {navbarRender()}
          <Routes>
            <Route path={BASE_PATH} element={<Home />} />

            <Route path={PROFILE_PATH} element={<Profile />} />

            <Route element={<AdminProtected />}>
              <Route path={DASHBOARD_PATH} element={<Dashboard />} />
              <Route path={REPORT_PATH} element={<Report />} />
              <Route path={USER_MANAGE_PATH} element={<User />} />
              <Route path={ORDER_MANAGE_PATH} element={<Order />} />
              <Route path={ORDER_ITEM_MANAGE_PATH} element={<OrderItem />} />
              <Route path={PRODUCT_MANAGE_PATH} element={<Product />} />
              <Route path={REVIEW_MANAGE_PATH} element={<Review />} />
            </Route>

            <Route path={SIGN_IN_PATH} element={<SignIn />} />
            <Route path={SIGN_UP_PATH} element={<SignUp />} />
          </Routes>
        </Suspense>
      </SidebarProvider>
    </TooltipProvider>
  )
}

export default App

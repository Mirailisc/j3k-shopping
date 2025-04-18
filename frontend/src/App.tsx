import React, { Suspense, useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
  ADMIN_BASE_PATH,
  ADMIN_DASHBOARD_PATH,
  BASE_PATH,
  ORDER_MANAGE_PATH,
  PRODUCT_INFO_PATH,
  PRODUCT_MANAGE_PATH,
  PRODUCT_PATH,
  PROFILE_PATH,
  REPORT_PATH,
  REVIEW_MANAGE_PATH,
  SELLER_DASHBOARD_PATH,
  SIGN_IN_PATH,
  SIGN_UP_PATH,
  USER_INFO_PATH,
  USER_MANAGE_PATH,
} from '@/constants/routes'
import SignIn from './pages/Auth/SignIn'
import SignUp from './pages/Auth/SignUp'
import AdminNavbar from './components/Admin/utils/AdminNavbar'
import { SidebarProvider } from './context/providers/SidebarProvider'
import Report from './pages/Admin/Report'
import User from './pages/Admin/User'
import Product from './pages/Admin/Products'
import Order from './pages/Admin/Order'
import Review from './pages/Admin/Review'
import { toast, Toaster } from 'sonner'
import { TooltipProvider } from './components/ui/tooltip'
import AdminProtected from './components/utils/AdminProtected'
import { RootState, useAppDispatch } from './store/store'
import { ACCESS_TOKEN } from './constants/cookie'
import { useCookies } from 'react-cookie'
import { me } from './store/slice/authSlice'
import Loading from './pages/Loading'
import Navbar from './components/User/utils/Navbar'
import { AnimatePresence } from 'framer-motion'
import Products from './pages/Product/Products'
import Protected from './components/utils/Protected'
import SellerDashboard from './pages/Seller/Dashboard'
import AdminDashboard from './pages/Admin/Dashboard'
import NotFound from './pages/NotFound'
import { useSelector } from 'react-redux'
import UserInfo from './pages/Profile/UserInfo'
import Profile from './pages/Profile/Profile'
import ProductInfo from './pages/Product/ProductInfo'

const Home = React.lazy(() => import('@/pages/Home'))

function App() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const [cookie, , removeCookie] = useCookies([ACCESS_TOKEN])
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  const navbarRender = () => {
    if (location.pathname.includes(ADMIN_BASE_PATH)) return <AdminNavbar />
    else if (location.pathname === SIGN_IN_PATH && !isAuthenticated) return <></>
    else if (location.pathname === SIGN_UP_PATH && !isAuthenticated) return <></>
    else return <Navbar />
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
    <AnimatePresence mode="wait">
      <TooltipProvider>
        <SidebarProvider>
          <Suspense fallback={<Loading />}>
            <Toaster />
            {navbarRender()}
            <Routes>
              <Route path={BASE_PATH} element={<Home />} />
              <Route path={PRODUCT_PATH} element={<Products />} />
              <Route path={PRODUCT_INFO_PATH} element={<ProductInfo />} />
              <Route path={USER_INFO_PATH} element={<UserInfo />} />

              <Route element={<Protected />}>
                <Route path={PROFILE_PATH} element={<Profile />} />
                <Route path={SELLER_DASHBOARD_PATH} element={<SellerDashboard />} />
              </Route>

              <Route element={<AdminProtected />}>
                <Route path={ADMIN_DASHBOARD_PATH} element={<AdminDashboard />} />
                <Route path={REPORT_PATH} element={<Report />} />
                <Route path={USER_MANAGE_PATH} element={<User />} />
                <Route path={ORDER_MANAGE_PATH} element={<Order />} />
                <Route path={PRODUCT_MANAGE_PATH} element={<Product />} />
                <Route path={REVIEW_MANAGE_PATH} element={<Review />} />
              </Route>

              {!isAuthenticated && (
                <>
                  <Route path={SIGN_UP_PATH} element={<SignUp />} />
                  <Route path={SIGN_IN_PATH} element={<SignIn />} />
                </>
              )}

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </SidebarProvider>
      </TooltipProvider>
    </AnimatePresence>
  )
}

export default App

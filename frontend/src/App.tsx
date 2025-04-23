import React, { Suspense, useEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
  ADMIN_BASE_PATH,
  ADMIN_DASHBOARD_PATH,
  BASE_PATH,
  CHECKOUT_PATH,
  ORDER_CONFIRMATION_PATH,
  ORDER_INFO_PATH,
  ORDER_MANAGE_PATH,
  ORDER_PATH,
  PRODUCT_INFO_PATH,
  PRODUCT_MANAGE_PATH,
  PRODUCT_PATH,
  PROFILE_PATH,
  REPORT_PATH,
  REVIEW_MANAGE_PATH,
  SELLER_DASHBOARD_PATH,
  SELLER_ORDER_PATH,
  SELLER_PATH,
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
import Profile from './pages/Profile'
import ProductInfo from './pages/Product/ProductInfo'
import SellerOrder from './pages/Seller/Order'
import { Footer } from './components/utils/Footer'
import OrderConfirmation from './pages/Checkout/OrderConfirmation'
import Checkout from './pages/Checkout'
import OrderInfo from './pages/Order/OrderInfo'
import Orders from './pages/Order'
import { axiosInstance } from './lib/axios'
import ServerDown from './pages/ServerDown'

const Home = React.lazy(() => import('@/pages/Home'))

function App() {
  const [isServerDown, setServerDown] = useState<boolean>(false)

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

  const footerRender = () => {
    if (location.pathname.includes(ADMIN_BASE_PATH)) return <></>
    else if (location.pathname === SIGN_IN_PATH && !isAuthenticated) return <></>
    else if (location.pathname === SIGN_UP_PATH && !isAuthenticated) return <></>
    else if (location.pathname.includes(SELLER_PATH)) return <></>
    else return <Footer />
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

  useEffect(() => {
    axiosInstance
      .get('/health')
      .then(() => setServerDown(false))
      .catch(() => setServerDown(true))
  }, [])

  if (isServerDown) return <ServerDown />

  return (
    <AnimatePresence mode="wait">
      <TooltipProvider>
        <SidebarProvider>
          <Suspense fallback={<Loading />}>
            <Toaster />
            <div className="flex flex-col min-h-screen">
              {navbarRender()}
              <main className="flex-1">
                <Routes>
                  <Route path={BASE_PATH} element={<Home />} />
                  <Route path={PRODUCT_PATH} element={<Products />} />
                  <Route path={PRODUCT_INFO_PATH} element={<ProductInfo />} />
                  <Route path={USER_INFO_PATH} element={<UserInfo />} />

                  <Route element={<Protected />}>
                    <Route path={PROFILE_PATH} element={<Profile />} />

                    <Route path={SELLER_DASHBOARD_PATH} element={<SellerDashboard />} />
                    <Route path={SELLER_ORDER_PATH} element={<SellerOrder />} />

                    <Route path={ORDER_PATH} element={<Orders />} />
                    <Route path={ORDER_INFO_PATH} element={<OrderInfo />} />

                    <Route path={CHECKOUT_PATH} element={<Checkout />} />
                    <Route path={ORDER_CONFIRMATION_PATH} element={<OrderConfirmation />} />
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
              </main>
              {footerRender()}
            </div>
          </Suspense>
        </SidebarProvider>
      </TooltipProvider>
    </AnimatePresence>
  )
}

export default App

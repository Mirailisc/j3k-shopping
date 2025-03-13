import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { BASE_PATH, SIGN_IN_PATH } from '@/constants/routes'
import Loading from '@/pages/Loading'

const AdminProtected: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useSelector((state: RootState) => state.auth)

  if (isLoading) {
    return <Loading />
  }

  if (!isAuthenticated) {
    return <Navigate to={SIGN_IN_PATH} replace />
  }

  if (user && !user.isAdmin && !user.isSuperAdmin) {
    return <Navigate to={BASE_PATH} replace />
  }

  return <Outlet />
}

export default AdminProtected

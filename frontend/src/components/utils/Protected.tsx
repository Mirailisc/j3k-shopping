import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { SIGN_IN_PATH } from '@/constants/routes'
import Loading from '@/pages/Loading'

const Protected: React.FC = () => {
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth)

  if (isLoading) {
    return <Loading />
  }

  if (!isAuthenticated) {
    return <Navigate to={SIGN_IN_PATH} replace />
  }

  return <Outlet />
}

export default Protected

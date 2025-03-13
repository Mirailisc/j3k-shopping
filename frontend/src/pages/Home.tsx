import { BASE_PATH, DASHBOARD_PATH, SIGN_IN_PATH, SIGN_UP_PATH } from '@/constants/routes'
import { RootState } from '@/store/store'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Home: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  return (
    <div className="flex flex-col gap-2">
      {isAuthenticated && <div>Logged in as {user?.username}</div>}
      <Link to={BASE_PATH}>Home</Link>
      <Link to={SIGN_IN_PATH}>Sign In</Link>
      <Link to={SIGN_UP_PATH}>Sign Up</Link>
      {isAuthenticated && <Link to={DASHBOARD_PATH}>Admin Dashboard</Link>}
    </div>
  )
}

export default Home

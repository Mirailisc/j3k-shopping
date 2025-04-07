import Sidebar from '@/components/Admin/utils/Sidebar'
import { UsersDataTable } from '@/components/Admin/User/Table'
import { useSidebar } from '@/context/hooks/useSidebar'
import { useEffect, useState } from 'react'
import { axiosInstance } from '@/lib/axios'
import { FullUserInfo } from '@/types/user'

const User: React.FC = () => {
  const sidebar = useSidebar()

  const [data, setData] = useState<FullUserInfo[]>([])

  const fetchUsers = async () => {
    const { data } = await axiosInstance.get('/user')
    setData(data)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div>
      <div className={`transition-all duration-300 ${sidebar?.isSidebarOpen ? 'ml-[260px]' : 'ml-[70px]'}`}>
        <Sidebar />

        <div className="p-4">
          <h1 className="text-4xl mt-2 font-bold">User Management</h1>
          <UsersDataTable data={data} setData={setData} fetchUsers={fetchUsers} />
        </div>
      </div>
    </div>
  )
}

export default User

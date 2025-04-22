import { axiosInstance } from '@/lib/axios'
import { Profile as ProfileType } from '@/types/profile'
import { isAxiosError } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import ProfileSocial from '@/components/User/Profile/Social'
import Gravatar from 'react-gravatar'
import { useParams } from 'react-router-dom'
import Loading from '../Loading'
import NotFound from '../NotFound'

const UserInfo: React.FC = () => {
  const [info, setInfo] = useState<ProfileType | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const { username } = useParams()

  const getUserInfo = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/profile/${username}`)
      setInfo(response.data)
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Something went wrong'
        toast.error(errorMessage)
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }, [username])

  useEffect(() => {
    getUserInfo()
  }, [getUserInfo])

  if (loading) return <Loading />
  else if (!info) return <NotFound />

  return (
    <div className="p-10">
      <div className="flex mt-10 flex-col gap-4">
        <div className="p-4">
          <Gravatar email={info.email} size={150} className="rounded-full" />
          <h3 className="font-bold text-2xl mt-4">{info.firstName + ' ' + info.lastName}</h3>
          <div className="text-zinc-400">{info.username}</div>
        </div>
        <div className="bg-zinc-100 border-black/20 dark:bg-zinc-900 rounded-md p-4 border dark:border-white/10">
          <div className="flex justify-between">
            <h3 className="font-bold text-xl mb-4">Social</h3>
          </div>
          <ProfileSocial social={info.social} />
        </div>
      </div>
    </div>
  )
}
export default UserInfo

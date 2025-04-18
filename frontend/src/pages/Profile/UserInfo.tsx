import { axiosInstance } from '@/lib/axios'
import { Profile as ProfileType } from '@/types/profile'
import { isAxiosError } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import ProfileSocial from '@/components/User/Profile/Social'
import Gravatar from 'react-gravatar'
import { useParams } from 'react-router-dom'
import Loading from '../Loading'

const UserInfo: React.FC = () => {
  const [info, setInfo] = useState<ProfileType | null>(null)

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
    }
  }, [username])

  useEffect(() => {
    getUserInfo()
  }, [getUserInfo])

  if (!info) {
    return <Loading />
  }

  return (
    <div className="p-10">
      <div className="flex mt-10 flex-col gap-4">
        <div className="p-4">
          <Gravatar email={info.email} size={150} className="rounded-full" />
          <h3 className="font-bold text-2xl mt-4">{info.firstName + ' ' + info.lastName}</h3>
          <div className="text-zinc-400">{info.username}</div>
        </div>
        <div className="bg-zinc-900 rounded-md p-4 border border-white/10">
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

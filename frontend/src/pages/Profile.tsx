import { axiosInstance } from '@/lib/axios'
import { RootState } from '@/store/store'
import { Profile as ProfileType } from '@/types/profile'
import { isAxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import Loading from './Loading'
import { ChevronLeft, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProfileSocial from '@/components/User/Profile/Social'
import ProfileSocialEditForm from '@/components/User/Profile/SocialEditForm'
import Gravatar from 'react-gravatar'
import { useNavigate } from 'react-router-dom'

const Profile: React.FC = () => {
  const [info, setInfo] = useState<ProfileType | null>(null)
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)

  const getProfile = async () => {
    try {
      const response = await axiosInstance.get('/profile')
      setInfo(response.data)
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Something went wrong'
        toast.error(errorMessage)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }

  useEffect(() => {
    if (user) {
      getProfile()
    }
  }, [user])

  if (!info) {
    return <Loading />
  }

  return (
    <div className="p-10">
      <Button variant="outline" onClick={() => navigate(-1)}>
        <ChevronLeft /> Back
      </Button>
      <div className="flex mt-10 flex-col gap-4">
        <div className="p-4">
          <Gravatar email={info.email} size={150} className="rounded-full" />
          <h3 className="font-bold text-2xl mt-4">{info.firstName + ' ' + info.lastName}</h3>
          <div className="text-zinc-400">{info.username}</div>
        </div>
        <div className="bg-zinc-900 rounded-md p-4 border border-white/10">
          <div className="flex justify-between">
            <h3 className="font-bold text-xl mb-4">Social</h3>
            {!isEditing && (
              <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
                <Pencil />
              </Button>
            )}
          </div>
          {isEditing ? (
            <ProfileSocialEditForm social={info.social} setIsEditing={setIsEditing} />
          ) : (
            <ProfileSocial social={info.social} />
          )}
        </div>
      </div>
    </div>
  )
}
export default Profile

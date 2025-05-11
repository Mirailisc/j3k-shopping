'use client'

import type React from 'react'

import { axiosInstance } from '@/lib/axios'
import type { RootState } from '@/store/store'
import type { Profile as ProfileType, Shipping } from '@/types/profile'
import { isAxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProfileSocial from '@/components/User/Profile/Social'
import ProfileSocialEditForm from '@/components/User/Profile/SocialEditForm'
import Gravatar from 'react-gravatar'
import Loading from '../Loading'
import NotFound from '../NotFound'
import ShippingInfoEditForm from '@/components/User/Profile/ShippingInfoEditForm'
import ShippingInfo from '@/components/User/Profile/ShippingInfo'

const Profile: React.FC = () => {
  const [info, setInfo] = useState<ProfileType | null>(null)
  const [shipping, setShipping] = useState<Shipping>({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    zipCode: '',
    country: '',
  })
  const [loading, setLoading] = useState<boolean>(true)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isEditingShipping, setIsEditingShipping] = useState<boolean>(false)
  const { user } = useSelector((state: RootState) => state.auth)

  const getProfile = async () => {
  try {
    const response = await axiosInstance.get('/profile')
    const rawData = response.data

    // Parse the `social` field if it's a string
    const parsedSocial =
      typeof rawData.social === 'string' ? JSON.parse(rawData.social) : rawData.social

    // Safely assign the parsed data
    setInfo({
      ...rawData,
      social: parsedSocial,
    })
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
}

  const getShippingInfo = async () => {
    try {
      const response = await axiosInstance.get('/profile/shipping-info')
      setShipping({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        phone: response.data.phone,
        address: response.data.address,
        city: response.data.city,
        province: response.data.province,
        zipCode: response.data.zipCode,
        country: response.data.country,
      })
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
      getShippingInfo()
    }
  }, [user])

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

        {/* Social Section */}
        <div className="bg-zinc-100 border-black/20 dark:bg-zinc-900 rounded-md p-4 border dark:border-white/10">
          <div className="flex justify-between">
            <h3 className="font-bold text-xl mb-4">Social</h3>
            {!isEditing && (
              <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>
          {isEditing ? (
            <ProfileSocialEditForm social={info.social} setIsEditing={setIsEditing} />
          ) : (
            <ProfileSocial social={info.social} />
          )}
        </div>

        {/* Shipping Information Section */}
        <div className="bg-zinc-100 border-black/20 dark:bg-zinc-900 rounded-md p-4 border dark:border-white/10">
          <div className="flex justify-between">
            <h3 className="font-bold text-xl mb-4">Shipping Information</h3>
            {!isEditingShipping && (
              <Button variant="outline" size="icon" onClick={() => setIsEditingShipping(true)}>
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>
          {isEditingShipping ? (
            <ShippingInfoEditForm shipping={shipping} setIsEditingShipping={setIsEditingShipping} setShipping={setShipping} />
          ) : (
            <ShippingInfo shipping={shipping} />
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile

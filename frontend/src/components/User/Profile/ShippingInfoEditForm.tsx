import type React from 'react'

import { useState } from 'react'
import { toast } from 'sonner'
import { isAxiosError } from 'axios'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { axiosInstance } from '@/lib/axios'
import type { Shipping } from '@/types/profile'

interface ShippingInfoEditFormProps {
  shipping: Shipping
  setIsEditingShipping: (isEditing: boolean) => void
  setShipping: (shipping: Shipping) => void
}

const ShippingInfoEditForm: React.FC<ShippingInfoEditFormProps> = ({ setShipping, shipping, setIsEditingShipping }) => {
  const [formData, setFormData] = useState<Shipping>({
    firstName: shipping.firstName || '',
    lastName: shipping.lastName || '',
    phone: shipping.phone || '',
    address: shipping.address || '',
    city: shipping.city || '',
    province: shipping.province || '',
    zipCode: shipping.zipCode || '',
    country: shipping.country || '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await axiosInstance.put('/profile/shipping-info', formData)
      toast.success('Shipping information updated successfully')
      setShipping({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        phone: response.data.contact.phone,
        address: response.data.contact.address,
        city: response.data.contact.city,
        province: response.data.contact.province,
        zipCode: response.data.contact.zipCode,
        country: response.data.contact.country,
      })
      setIsEditingShipping(false)
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Failed to update shipping information'
        toast.error(errorMessage)
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" />
          <div className='text-xs text-muted-foreground'>Phone number should belong to your PromptPay account</div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Street Address"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" value={formData.city} onChange={handleChange} placeholder="City" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="province">Province/State</Label>
          <Input
            id="province"
            name="province"
            value={formData.province}
            onChange={handleChange}
            placeholder="Province or State"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipCode">Zip Code</Label>
          <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="Zip Code" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input id="country" name="country" value={formData.country} onChange={handleChange} placeholder="Country" />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => setIsEditingShipping(false)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}

export default ShippingInfoEditForm

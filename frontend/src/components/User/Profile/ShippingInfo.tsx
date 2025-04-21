import type React from 'react'
import type { Shipping } from '@/types/profile'

interface ShippingInfoProps {
  shipping: Shipping
}

const ShippingInfo: React.FC<ShippingInfoProps> = ({ shipping }) => {
  if (!shipping || Object.values(shipping).every((value) => !value)) {
    return <p className="text-muted-foreground italic">No shipping information added yet.</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-1">Name</h4>
        <p>
          {shipping.firstName} {shipping.lastName}
        </p>
      </div>

      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-1">Phone</h4>
        <p>{shipping.phone || '—'}</p>
      </div>

      <div className="md:col-span-2">
        <h4 className="text-sm font-medium text-muted-foreground mb-1">Address</h4>
        <p>{shipping.address || '—'}</p>
      </div>

      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-1">City</h4>
        <p>{shipping.city || '—'}</p>
      </div>

      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-1">Province</h4>
        <p>{shipping.province || '—'}</p>
      </div>

      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-1">Zip Code</h4>
        <p>{shipping.zipCode || '—'}</p>
      </div>

      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-1">Country</h4>
        <p>{shipping.country || '—'}</p>
      </div>
    </div>
  )
}

export default ShippingInfo

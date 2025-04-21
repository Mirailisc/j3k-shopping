import { Social } from './user'

export type Profile = {
  username: string
  firstName: string
  lastName: string
  email: string
  isAdmin: boolean
  isSuperAdmin: boolean
  social: Partial<Social>
}

export interface Shipping {
  firstName: string
  lastName: string
  phone: string
  address: string
  city: string
  province: string
  zipCode: string
  country: string
}

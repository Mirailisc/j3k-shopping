export type User = {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  isAdmin: boolean
  isSuperAdmin: boolean
  createdAt: string
}

export type Social = {
  line: string
  facebook: string
  website: string
  instagram: string
  tiktok: string
}

export type Contact = {
  phone: string
  address: string
  city: string
  province: string
  zipCode: string
  country: string
}

export type FullUserInfo = User & Social & Contact

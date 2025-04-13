import { Social } from '../../social/entities/social.entity'

export class Profile {
  username: string
  firstName: string
  lastName: string
  email: string
  isAdmin: boolean
  isSuperAdmin: boolean
  social: Partial<Social>
}

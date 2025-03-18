import { Social } from './social.entity'

export class Profile {
  username: string
  firstName: string
  lastName: string
  isAdmin: boolean
  social: Partial<Social>
}

import { Contact } from 'src/contact/entities/contact.entity'
import { Social } from '../../social/entities/social.entity'

export class Profile {
  username: string
  firstName: string
  lastName: string
  isAdmin: boolean
  social: Partial<Social>
  contact: Partial<Contact>
}

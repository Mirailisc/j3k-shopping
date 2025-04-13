import { Social } from "./user"

export type Profile = {
    username: string
    firstName: string
    lastName: string
    email: string
    isAdmin: boolean
    isSuperAdmin: boolean
    social: Partial<Social>
}
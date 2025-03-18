import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { axiosInstance } from '@/lib/axios'
import Loading from '@/pages/Loading'
import { Social, User } from '@/types/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

type UserProfile = Pick<User, 'username' | 'firstName' | 'lastName' | 'isAdmin' | 'email'>
type SocialProfile = Partial<Social>

type Profile = UserProfile & {
  social: SocialProfile
}

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
})

const Profile: React.FC = () => {
  const [user, setUser] = useState<Profile | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
    },
  })

  const getProfile = async () => {
    try {
      const response = await axiosInstance.get('/profile')
      setUser(response.data)
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Something went wrong'
        toast.error(errorMessage)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }

  const onEditSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(JSON.stringify(values, null, 2))
    setIsEditing(false)
  }

  useEffect(() => {
    getProfile()
  }, [])

  useEffect(() => {
    if (user) {
      form.setValue('firstName', user.firstName)
      form.setValue('lastName', user.lastName)
    }
  }, [form, user])

  if (!user) {
    return <Loading />
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="xl:w-[1024px] w-full grid gap-4">
        <div className="grid lg:grid-cols-[400px_1fr] gap-4">
          <div className="border border-white/20 rounded-sm p-4 flex flex-col items-center">
            <img src={`https://github.com/${user.username}.png`} alt="avatar" className="w-32 h-32 rounded-full" />
            <h1 className="text-2xl mt-4 text-white font-bold">
              {user.firstName} {user.lastName}
            </h1>
            <div className="text-zinc-400">{user.username}</div>
          </div>
          <Card className="border border-white/20 rounded-sm p-4 flex flex-col justify-between h-full">
            {isEditing ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onEditSubmit)} className="flex flex-col justify-between h-full">
                  <div>
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <Label htmlFor="firstName">First Name</Label>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <Label htmlFor="lastName">Last Name</Label>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button onClick={() => setIsEditing(true)} className="mt-4 w-full" variant="default">
                    Save
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="text-zinc-400">Full name</div>
                  <div className="text-xl text-white font-bold">
                    {user.firstName} {user.lastName}
                  </div>
                </div>
                <Button onClick={() => setIsEditing(true)} className="mt-4 w-full" variant="default">
                  Edit
                </Button>
              </div>
            )}
          </Card>
        </div>
        <div className="grid lg:grid-cols-[400px_1fr] gap-4">
          <div className="border border-white/20 rounded-sm p-4 flex flex-col">
            <h2 className="text-xl text-white font-bold">Social Links</h2>
            <div className="mt-2 flex flex-col gap-2">
              {user.social &&
                Object.entries(user.social).map(([platform, link], index) => {
                  if (link) {
                    return (
                      <a
                        key={platform}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        {platform}
                      </a>
                    )
                  } else {
                    return <div key={index}></div>
                  }
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

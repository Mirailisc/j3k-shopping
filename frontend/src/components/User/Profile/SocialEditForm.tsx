import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { axiosInstance } from '@/lib/axios'
import { Social } from '@/types/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

type Props = {
  social: Partial<Social>
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
}

const httpsUrl = z
  .string()
  .optional()
  
const formSchema = z.object({
  line: httpsUrl,
  facebook: httpsUrl,
  instagram: httpsUrl,
  tiktok: httpsUrl,
  website: httpsUrl,
})

const ProfileSocialEditForm: React.FC<Props> = ({ social, setIsEditing }: Props) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      line: social.line,
      facebook: social.facebook,
      instagram: social.instagram,
      tiktok: social.tiktok,
      website: social.website,
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axiosInstance.put('/social/me', values)
      toast.success('Social links have been updated')
      setIsEditing(false)
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Something went wrong'
        toast.error(errorMessage)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }

  const onCancel = () => {
    setIsEditing(false)
    form.reset()
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="line"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="line">Line</Label>
                <FormControl>
                  <Input placeholder="Line URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="facebook"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="facebook">Facebook</Label>
                <FormControl>
                  <Input placeholder="Facebook URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="instagram"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="instagram">Instagram</Label>
                <FormControl>
                  <Input placeholder="Instagram URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tiktok"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="tiktok">TikTok</Label>
                <FormControl>
                  <Input placeholder="TikTok URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="website">Website</Label>
                <FormControl>
                  <Input placeholder="Website URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-row justify-end gap-2">
            <Button variant="secondary" onClick={onCancel} type="button">
              Cancel
            </Button>
            <Button variant="default" type="submit">
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default ProfileSocialEditForm

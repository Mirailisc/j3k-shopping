// components/user-combobox.tsx
import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { useFormContext, Controller } from 'react-hook-form'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Command, CommandInput, CommandItem, CommandList, CommandEmpty } from '@/components/ui/command'
import { Label } from '@/components/ui/label'
import { FormItem, FormMessage } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { axiosInstance } from '@/lib/axios'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'

type User = {
  id: string
  username: string
}

type Props = {
  name: string
  label?: string
}

export const UserCombobox: React.FC<Props> = ({ name, label = 'User' }: Props) => {
  const { control, setValue } = useFormContext()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 300)
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    if (!debouncedSearch) return
    const fetch = async () => {
      try {
        const res = await axiosInstance.get('/search/users', {
          params: { search: debouncedSearch },
        })
        setUsers(res.data)
      } catch (e) {
        if (isAxiosError(e)) {
          const errorMessage = e.response?.data?.message || 'Something went wrong'
          toast.error(errorMessage)
        } else {
          toast.error('An unexpected error occurred')
        }
      }
    }
    fetch()
  }, [debouncedSearch])

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const selectedUser = users.find((u) => u.id === field.value)

        return (
          <FormItem>
            <Label>{label}</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <div
                  onClick={() => setOpen(true)}
                  className={cn(
                    'w-full border rounded-md px-3 py-[6px] text-left text-sm cursor-pointer',
                    !selectedUser && 'text-muted-foreground',
                    fieldState.invalid && 'border-destructive',
                  )}
                >
                  {selectedUser?.username || 'Select a user'}
                </div>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-full">
                <Command>
                  <CommandInput placeholder="Search user..." value={search} onValueChange={setSearch} />
                  <CommandList>
                    <CommandEmpty>No users found.</CommandEmpty>
                    {users.map((user) => (
                      <CommandItem
                        key={user.id}
                        value={user.username}
                        onSelect={() => {
                          setValue(name, user.id)
                          setOpen(false)
                        }}
                      >
                        {user.username}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

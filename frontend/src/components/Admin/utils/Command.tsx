import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  ADMIN_DASHBOARD_PATH,
  ORDER_MANAGE_PATH,
  PRODUCT_MANAGE_PATH,
  REPORT_PATH,
  REVIEW_MANAGE_PATH,
  USER_MANAGE_PATH,
} from '@/constants/routes'
import { ChartArea, CircleGauge, Package, ShoppingBag, UserRound } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

const Command: React.FC<Props> = ({ open, setOpen }: Props) => {
  const navigate = useNavigate()

  const handleCommandItemSelect = (path: string) => {
    navigate(path)
    setOpen(false)
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="General">
          <CommandItem onSelect={() => handleCommandItemSelect(ADMIN_DASHBOARD_PATH)}>
            <CircleGauge />
            <span>Dashboard</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Database Management">
          <CommandItem onSelect={() => handleCommandItemSelect(USER_MANAGE_PATH)}>
            <UserRound />
            <span>Users</span>
          </CommandItem>
          <CommandItem onSelect={() => handleCommandItemSelect(PRODUCT_MANAGE_PATH)}>
            <ShoppingBag />
            <span>Products</span>
          </CommandItem>
          <CommandItem onSelect={() => handleCommandItemSelect(ORDER_MANAGE_PATH)}>
            <Package />
            <span>Orders</span>
          </CommandItem>
          <CommandItem onSelect={() => handleCommandItemSelect(REVIEW_MANAGE_PATH)}>
            <UserRound />
            <span>Reviews</span>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Analytics">
          <CommandItem onSelect={() => handleCommandItemSelect(REPORT_PATH)}>
            <ChartArea />
            <span>Reports</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

export default Command

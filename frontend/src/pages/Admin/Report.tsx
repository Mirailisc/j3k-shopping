import MostRefundedUserCard from '@/components/Admin/Report/card/MostRefundedUserCard'
import MostReviewedUserCard from '@/components/Admin/Report/card/MostReviewedUserCard'
import { MostSales } from '@/components/Admin/Report/graph/MostSales'
import NewUserCard from '@/components/Admin/Report/card/NewUserCard'
import Sidebar from '@/components/Admin/utils/Sidebar'
import { useSidebar } from '@/context/hooks/useSidebar'
import { UnsatisfyCustomerTable } from '@/components/Admin/Report/UnsastifyCustomer'
import { UnsatisfyProductTable } from '@/components/Admin/Report/UnsastifyProduct'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuItemIndicator, DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu'
import { ChevronDown, Dot } from 'lucide-react'
import { useState } from 'react'
import { TimePeriod } from '@/components/Admin/Report/types/TimePeriod'
import StatusCountGraph from '@/components/Admin/Report/graph/StatusCountGraph'
import IncomeFromTaxes from '@/components/Admin/Report/card/IncomeFromTaxes'

const Report: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState('INTERVAL 1 MONTH')
  const sidebar = useSidebar()
  
  return (
    <div>
      <div className={`transition-all duration-300 ${sidebar?.isSidebarOpen ? 'ml-[260px]' : 'ml-[70px]'}`}>
        <Sidebar />

        <div className="p-4">
          <div className = 'flex flex-row justify-between'>
            <h1 className="text-4xl mt-2 font-bold">Reports</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="text-sm h-10 w-30">
                  Time Range
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="mt-[5px] px-2 py-2 border border-black/20 dark:border-white/10 rounded-sm w-30 z-1 bg-zinc-100 dark:bg-zinc-900">
                <DropdownMenuSeparator className="py-1" />
                <DropdownMenuLabel>Time Period</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={timePeriod} onValueChange={setTimePeriod}>
                  {TimePeriod.map((item) => {
                    return (
                      <DropdownMenuRadioItem
                        key={item.value}
                        value={item.value}
                        className="text-sm focus:outline-none focus:opacity-50"
                      >
                        <DropdownMenuItemIndicator>
                          <Dot className="rounded-full mx-1 h-[5px] w-[5px] inline-flex bg-current focus:outline-none focus:ring-2 focus:ring-white" />
                        </DropdownMenuItemIndicator>
                        {item.label}
                      </DropdownMenuRadioItem>
                    )
                  })}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
            <MostReviewedUserCard />
            <MostRefundedUserCard />
            <NewUserCard timePeriod= {timePeriod}/>
            <IncomeFromTaxes timePeriod= {timePeriod} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <MostSales timePeriod= {timePeriod}/>
            <UnsatisfyCustomerTable />
            <StatusCountGraph timePeriod= {timePeriod} />
            <UnsatisfyProductTable />
          </div>
          <div className='mt-2'>
           
          </div>
        </div>
      </div>
    </div>
  )
}

export default Report

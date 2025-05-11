import { TimePeriod } from "@/components/Seller/Report/types/TimePeriod";
import SellerTabs from "@/components/Seller/utils/SellerTabs";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuItemIndicator } from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Dot } from "lucide-react";
import React, { useState } from "react";
import { TotalRevenueCard } from "@/components/Seller/Report/cards/TotalRevenueCard";
import { MostSalesProductCard } from "@/components/Seller/Report/cards/MostSalesProductCard";
import { UnsoldProductsCard } from "@/components/Seller/Report/cards/UnsoldProducts";
import { AverageRatingCard } from "@/components/Seller/Report/cards/AverageRatingCard";
import { MostSalesProductGraphSeller } from "@/components/Seller/Report/MostSalesProductGraph";
import { SellerStatusCountGraph } from "@/components/Seller/Report/SellerStatusGraph";
import { SellerProductStatTable } from "@/components/Seller/Report/SellerProductStatTable";

export const SellerReport: React.FC = () => {
    const [timePeriod, setTimePeriod] = useState<string>('1 month')
    
    return (
        <div className="mt-[60px]">
        <div className="p-4">
          <SellerTabs />
          <div className = 'my-8 flex flex-row justify-between'>
            <h1 className="text-4xl font-bold">Reports</h1>
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
                        key={item.label}
                        value={item.label}
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
            <AverageRatingCard />
            <TotalRevenueCard timePeriod= {timePeriod} />
            <MostSalesProductCard timePeriod= {timePeriod} />
            <UnsoldProductsCard timePeriod= {timePeriod}/>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <MostSalesProductGraphSeller timePeriod= {timePeriod} />
            <SellerProductStatTable />
            <SellerStatusCountGraph timePeriod= {timePeriod}/>
        
          </div>
        </div>
      </div>
    )
}
import { useRef, useState } from 'react'
import { Download, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Transaction } from '@/types/transaction'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TransactionTable } from './TransactionTable'
import { toast } from 'sonner'

// Sample data
const transactions: Transaction[] = [
  {
    id: 'INV001',
    date: new Date('2023-01-15'),
    description: 'Client payment - Project A',
    amount: 2500.0,
    type: 'income',
  },
  {
    id: 'EXP001',
    date: new Date('2023-01-18'),
    description: 'Office rent',
    amount: 1200.0,
    type: 'outcome',
  },
  {
    id: 'INV002',
    date: new Date('2023-01-25'),
    description: 'Client payment - Project B',
    amount: 3200.0,
    type: 'income',
  },
  {
    id: 'EXP002',
    date: new Date('2023-02-01'),
    description: 'Software subscription',
    amount: 49.99,
    type: 'outcome',
  },
  {
    id: 'EXP003',
    date: new Date('2023-02-05'),
    description: 'Team lunch',
    amount: 125.5,
    type: 'outcome',
  },
  {
    id: 'INV003',
    date: new Date('2023-02-10'),
    description: 'Consulting services',
    amount: 1800.0,
    type: 'income',
  },
  {
    id: 'EXP004',
    date: new Date('2023-02-15'),
    description: 'Marketing campaign',
    amount: 500.0,
    type: 'outcome',
  },
  {
    id: 'INV004',
    date: new Date('2023-02-20'),
    description: 'Client payment - Project C',
    amount: 4500.0,
    type: 'income',
  },
]

export default function BillingHistory() {
  const [activeTab, setActiveTab] = useState<string>('all')
  const [selectedMonth, setSelectedMonth] = useState<string>('all')
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions)

  const tableRef = useRef<HTMLDivElement>(null)

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  const totalOutcome = transactions
    .filter((t) => t.type === 'outcome')
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  // Update the filteredTransactions state to include month filtering
  // Replace the existing handleTabChange function with this updated version
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    filterTransactions(value, selectedMonth)
  }

  // Add a new function to handle month changes
  const handleMonthChange = (value: string) => {
    setSelectedMonth(value)
    filterTransactions(activeTab, value)
  }

  // Add a helper function to filter transactions by both tab and month
  const filterTransactions = (tabValue: string, monthValue: string) => {
    let filtered = transactions

    // Filter by transaction type
    if (tabValue !== 'all') {
      filtered = filtered.filter((t) => t.type === tabValue)
    }

    // Filter by month
    if (monthValue !== 'all') {
      const monthIndex = Number.parseInt(monthValue, 10)
      filtered = filtered.filter((t) => t.date.getMonth() === monthIndex)
    }

    setFilteredTransactions(filtered)
  }

  const exportTableAsPDF = () => {
    if (!tableRef.current) return

    toast.loading('Opening print dialog to save as PDF...')

    // Create a new window for printing
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      toast.error('Unable to open print dialog. Please check your popup blocker settings.')
      return
    }

    // Get the table element's HTML
    const tableHTML = tableRef.current.innerHTML

    // Create a styled document in the new window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Billing History - ${getMonthName(selectedMonth)}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            h1 {
              color: #333;
              margin-bottom: 5px;
            }
            .date {
              color: #666;
              font-size: 14px;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            .income {
              color: #10b981;
            }
            .outcome {
              color: #ef4444;
            }
            .badge {
              display: inline-block;
              padding: 3px 8px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: 500;
            }
            .completed {
              background-color: #10b981;
              color: white;
            }
            .pending {
              background-color: #f59e0b;
              color: black;
            }
          </style>
        </head>
        <body>
          <h1>Billing History - ${getMonthName(selectedMonth)}</h1>
          <div class="date">Generated on: ${new Date().toLocaleDateString()}</div>
          ${tableHTML}
        </body>
      </html>
    `)

    // Wait for content to load then print
    printWindow.document.close()
    printWindow.onload = () => {
      printWindow.print()
      // Close the window after print dialog is closed (optional)
      printWindow.onafterprint = () => {
        printWindow.close()
      }
    }
  }

  const exportTableAsCSV = () => {
    const headers = ['ID', 'Date', 'Description', 'Category', 'Status', 'Amount']

    const csvRows = [
      headers.join(','), // Header row
      ...filteredTransactions.map((t) => {
        const formattedDate = t.date.toLocaleDateString()
        const formattedAmount = `${t.type === 'income' ? '' : '-'}${t.amount.toFixed(2)}`
        return [t.id, formattedDate, `"${t.description}"`, formattedAmount].join(',')
      }),
    ]

    const csvContent = csvRows.join('\n')

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    // Create download link and click it
    const link = document.createElement('a')
    const fileName = `billing-history-${getMonthName(selectedMonth).toLowerCase()}-${new Date().getFullYear()}.csv`

    link.setAttribute('href', url)
    link.setAttribute('download', fileName)
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success('Your billing history has been exported as CSV.')
  }

  // Helper function to get month name
  const getMonthName = (monthValue: string) => {
    if (monthValue === 'all') return 'All Months'

    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]

    return monthNames[Number.parseInt(monthValue, 10)]
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing History</h1>
        <p className="text-muted-foreground">Track your income and expenses over time</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">${totalIncome.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+{(totalIncome * 0.12).toFixed(2)} from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalOutcome.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+{(totalOutcome * 0.05).toFixed(2)} from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Tabs defaultValue="all" className="w-full" onValueChange={handleTabChange}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="all">All Transactions</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="outcome">Expenses</TabsTrigger>
            </TabsList>

            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
              <Select value={selectedMonth} onValueChange={handleMonthChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  <SelectItem value="0">January</SelectItem>
                  <SelectItem value="1">February</SelectItem>
                  <SelectItem value="2">March</SelectItem>
                  <SelectItem value="3">April</SelectItem>
                  <SelectItem value="4">May</SelectItem>
                  <SelectItem value="5">June</SelectItem>
                  <SelectItem value="6">July</SelectItem>
                  <SelectItem value="7">August</SelectItem>
                  <SelectItem value="8">September</SelectItem>
                  <SelectItem value="9">October</SelectItem>
                  <SelectItem value="10">November</SelectItem>
                  <SelectItem value="11">December</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuCheckboxItem checked>Completed</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked>Pending</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Cancelled</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                  <DropdownMenuCheckboxItem onClick={exportTableAsPDF}>Export as PDF</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem onClick={exportTableAsCSV}>Export as CSV</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div ref={tableRef}>
            <TabsContent value="all" className="m-0">
              <TransactionTable transactions={filteredTransactions} />
            </TabsContent>
            <TabsContent value="income" className="m-0">
              <TransactionTable transactions={filteredTransactions} />
            </TabsContent>
            <TabsContent value="outcome" className="m-0">
              <TransactionTable transactions={filteredTransactions} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

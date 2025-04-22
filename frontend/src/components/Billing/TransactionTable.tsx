import { useState } from 'react'
import { format } from 'date-fns'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import type { Transaction } from '@/types/transaction'

interface TransactionTableProps {
  transactions: Transaction[]
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const [sorting, setSorting] = useState<{ column: string; direction: 'asc' | 'desc' }>({
    column: 'date',
    direction: 'desc',
  })

  // Sort transactions based on current sorting state
  const sortedTransactions = [...transactions].sort((a, b) => {
    const column = sorting.column as keyof Transaction

    if (column === 'date') {
      return sorting.direction === 'asc' ? a.date.getTime() - b.date.getTime() : b.date.getTime() - a.date.getTime()
    }

    if (column === 'amount') {
      return sorting.direction === 'asc' ? a.amount - b.amount : b.amount - a.amount
    }

    // For string columns
    const aValue = String(a[column])
    const bValue = String(b[column])

    return sorting.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
  })

  const handleSort = (column: string) => {
    setSorting((prev) => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">
              <Button variant="ghost" onClick={() => handleSort('id')} className="font-medium">
                ID
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('date')} className="font-medium">
                Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="min-w-[150px]">Description</TableHead>
            <TableHead className="text-right">
              <Button variant="ghost" onClick={() => handleSort('amount')} className="font-medium">
                Amount
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTransactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No transactions found.
              </TableCell>
            </TableRow>
          ) : (
            sortedTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.id}</TableCell>
                <TableCell>{format(transaction.date, 'MMM dd, yyyy')}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell
                  className={cn(
                    'text-right font-medium',
                    transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600',
                  )}
                >
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export function RefundedProductTable() {
    const [data, setData] = useState<RefundedProductName[]>([])
  
    const fetchData = async () => {
      const { data } = await axiosInstance('dashboard/admin/refunded-product')
      setData(data)
    }
  
    React.useEffect(() => {
      fetchData()
    }, [])
  
    const chartData = {
      labels: data.map((entry) => entry.productName),
      datasets: [
        {
          label: 'Refunded Count',
          data: data.map((entry) => entry.refundedCount),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    }
  
    const table = useReactTable({
      data,
      columns: refundedProductColumns,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
    })
  
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-normal text-zinc-400">Top Refunded Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Bar data={chartData} options={{ responsive: true }} />
          </div>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }
  
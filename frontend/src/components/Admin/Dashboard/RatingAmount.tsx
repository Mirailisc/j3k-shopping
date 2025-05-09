export function RatingAmountTable() {
    const [data, setData] = useState<RatingAmount[]>([])
  
    const fetchData = async () => {
      const { data } = await axiosInstance('dashboard/admin/rating-amount')
      setData(data)
    }
  
    React.useEffect(() => {
      fetchData()
    }, [])
  
    const chartData = {
      labels: data.map((entry) => entry.rating.toString()),
      datasets: [
        {
          label: 'Total Amount',
          data: data.map((entry) => entry.total_amount),
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1,
        },
      ],
    }
  
    const table = useReactTable({
      data,
      columns: ratingAmountColumns,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
    })
  
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-normal text-zinc-400">Total Amount per Rating</CardTitle>
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
  
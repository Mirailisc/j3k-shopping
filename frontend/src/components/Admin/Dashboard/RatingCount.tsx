export function RatingCountTable() {
    const [data, setData] = useState<RatingCount[]>([])
  
    const fetchData = async () => {
      const { data } = await axiosInstance('dashboard/admin/rating-count')
      setData(data)
    }
  
    React.useEffect(() => {
      fetchData()
    }, [])
  
    const chartData = {
      labels: data.map((entry) => entry.rating.toString()),
      datasets: [
        {
          label: 'Count',
          data: data.map((entry) => entry.count),
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
        },
      ],
    }
  
    const table = useReactTable({
      data,
      columns: ratingCountColumns,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
    })
  
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-normal text-zinc-400">Order Count per Rating</CardTitle>
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
  
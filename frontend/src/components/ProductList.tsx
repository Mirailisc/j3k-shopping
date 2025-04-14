import { ProductFeed } from '@/types/feed'

type Props = {
  products: ProductFeed[]
}

const ProductList: React.FC<Props> = ({ products }: Props) => {
  const renderAllProducts = products.map((product: ProductFeed) => {
    return (
      <div
        key={product.id}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-md w-full flex flex-col shadow-sm hover:shadow-md transition-shadow"
      >
        <img src={product.productImg} className="w-full h-64 object-cover rounded-t-md" alt={product.name} />
        <div className="p-4 flex flex-col gap-2 flex-1">
          <h3 className="text-base font-semibold line-clamp-2">{product.name}</h3>
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">฿{product.price.toFixed(2)}</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">In stock: {product.quantity}</div>
          <button className="mt-auto bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2 rounded-md transition-colors">
            Buy
          </button>
        </div>
      </div>
    )
  })

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {renderAllProducts}
    </div>
  )
}

export default ProductList
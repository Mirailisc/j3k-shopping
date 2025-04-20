import { IconInput } from '@/components/ui/icon-input'
import { PRODUCT_INFO_PATH } from '@/constants/routes'
import { axiosInstance } from '@/lib/axios'
import { ProductFeed } from '@/types/feed'
import { isAxiosError } from 'axios'
import { SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { toast } from 'sonner'

const ProductSearchInput: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm)
  const [searchResult, setSearchResult] = useState<Omit<ProductFeed, 'quantity'>[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)

  const location = useLocation()

  useEffect(() => {
    setSearchTerm('')
    setDebouncedTerm('')
    setSearchResult([])
    setSelectedIndex(-1)
  }, [location.pathname])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm)
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [searchTerm])

  useEffect(() => {
    if (debouncedTerm.trim() === '') {
      setSearchResult([])
      return
    }

    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.post(`/feed/search/${encodeURIComponent(debouncedTerm)}`)
        setSearchResult(res.data)
      } catch (err) {
        if (isAxiosError(err)) {
          const errorMessage = err.response?.data?.message || 'Something went wrong'
          toast.error(errorMessage)
        } else {
          toast.error('An unexpected error occurred')
        }
      }
    }

    fetchProducts()
  }, [debouncedTerm])

  return (
    <div className="hidden lg:block flex-1 max-w-md mx-6 relative">
      <IconInput
        startIcon={SearchIcon}
        placeholder="Search products"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value)
          setSelectedIndex(-1)
        }}
        onKeyDown={(e) => {
          if (searchResult.length === 0) return

          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setSelectedIndex((prev) => (prev + 1) % searchResult.length)
          } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setSelectedIndex((prev) => (prev - 1 + searchResult.length) % searchResult.length)
          } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault()
            const selectedProduct = searchResult[selectedIndex]
            if (selectedProduct) {
              window.location.href = `/product/${selectedProduct.id}`
            }
          }
        }}
        className="text-black dark:text-white dark:placeholder:text-zinc-400"
      />
      {searchResult.length > 0 && (
        <div className="absolute mt-1 w-full bg-zinc-800 text-white rounded-md shadow-lg border border-zinc-700 max-h-60 overflow-y-auto z-50">
          {searchResult.map((product, index) => {
            const isSelected = index === selectedIndex
            return (
              <Link
                key={product.id}
                to={PRODUCT_INFO_PATH.replace(':productId', product.id)}
                className={`flex items-center gap-3 px-4 py-2 transition-colors ${
                  isSelected ? 'dark:bg-zinc-700' : 'hover:bg-zinc-700'
                }`}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <img
                  src={product.productImg}
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded-sm border border-zinc-700"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs text-zinc-400">
                    ${product.price.toFixed(2)} · {product.seller}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ProductSearchInput

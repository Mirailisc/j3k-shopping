export type Product = {
  id: string
  name: string
  productImg: string
  description: string
  price: number
  quantity: number
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface ProductDisplay extends Omit<Product, 'updatedAt' | 'userId'> {
  seller: string
}
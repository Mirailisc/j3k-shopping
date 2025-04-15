export type Review = {
    id: string
    rating: number
    comment: string
    productId: string
    userId: string
    createdAt: Date
    updatedAt: Date
  }

export interface ReviewDisplay extends Omit<Review, 'updatedAt' | 'productId'> {
    email: string
    fullName: string
}
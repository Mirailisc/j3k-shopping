import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Review } from './entities/review.entity'
import { ReviewInfo } from './entities/review-info.entity'
import { CreateReviewDto } from './dto/create-review.dto'
import { randomUUID } from 'crypto'
import { ProductService } from 'src/product/product.service'

@Injectable()
export class ReviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productService: ProductService,
  ) {}

  async getAllReview() {
    const reviews = await this.prisma.$queryRaw<Review[]>`
      SELECT *
      FROM Review
    `

    return reviews.map((review) => ({
      ...review,
    }))
  }

  async getReviewById(id: string) {
    const review = await this.prisma.$queryRaw<Review[]>`
      SELECT *
      FROM Review
      WHERE id = ${id}
    `

    return review[0]
  }

  async getReviewInfo(productId: string) {
    const reviews = await this.prisma.$queryRaw<ReviewInfo[]>`
      SELECT R.id, R.rating, R.comment, R.userId, U.email, CONCAT(U.firstName, ' ', U.lastName) AS fullName, R.createdAt
      FROM Review R
      LEFT JOIN User U ON R.userId = U.id
      WHERE R.productId = ${productId}
    `

    return reviews
  }

  async createReview(
    createReviewDto: Omit<CreateReviewDto, 'userId'>,
    userId: string,
  ) {
    const uuid = randomUUID()
    const product = await this.productService.getProductById(
      createReviewDto.productId,
    )
    const existingReview = await this.getReviewInfo(createReviewDto.productId)

    if (product.userId === userId) {
      throw new BadRequestException('You cannot review your own product')
    }

    if (existingReview.find((review) => review.userId === userId)) {
      throw new BadRequestException('You have already reviewed this product')
    }

    await this.prisma.$executeRaw`
      INSERT INTO Review (id, rating, comment, productId, userId)
      VALUES (${uuid}, ${createReviewDto.rating}, ${createReviewDto.comment}, ${createReviewDto.productId}, ${userId})
    `

    return this.getReviewById(uuid)
  }
}

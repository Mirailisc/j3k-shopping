import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Review } from './entities/review.entity'
import { CreateReviewDto } from './dto/create-review.dto'
import { UpdateReviewDto } from './dto/update-review.dto'
import { randomUUID } from 'crypto'
import { Order } from '@prisma/client'
import { ReviewInfo } from './entities/review-info.entity'
import { ProductService } from 'src/product/product.service'

@Injectable()
export class ReviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productService: ProductService,
  ) {}

  async getAllReview() {
    const result = await this.prisma.$queryRaw<Review[]>`
      SELECT *
      FROM Review
    `
    return result
  }

  async getReviewById(id: string) {
    const review = await this.prisma.$queryRaw<
      Review[]
    >`SELECT * FROM REVIEW WHERE id = ${id}`

    if (!review || review.length === 0) {
      throw new NotFoundException('Review not found')
    }

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
    const existingOrder = await this.prisma.$queryRaw<Order[]>`SELECT id
      FROM \`Order\` o
      WHERE o.userId = ${userId} AND o.productId = ${createReviewDto.productId}
    `

    if (product.userId === userId) {
      throw new BadRequestException('You cannot review your own product')
    }

    if (existingOrder.length === 0) {
      throw new BadRequestException("User haven't order this before")
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

  async createReviewByAdmin(createReviewDto: CreateReviewDto) {
    const uuid = randomUUID()
    const product = await this.productService.getProductById(
      createReviewDto.productId,
    )
    const existingReview = await this.getReviewInfo(createReviewDto.productId)
    const existingOrder = await this.prisma.$queryRaw<Order[]>`SELECT id
      FROM \`Order\` o
      WHERE o.userId = ${createReviewDto.userId} AND o.productId = ${createReviewDto.productId}
    `

    // if (product.userId === createReviewDto.userId) {
    //   throw new BadRequestException('You cannot review your own product')
    // }

    // if (existingOrder.length === 0) {
    //   throw new BadRequestException("User haven't order this before")
    // }

    if (
      existingReview.find((review) => review.userId === createReviewDto.userId)
    ) {
      throw new BadRequestException('You have already reviewed this product')
    }

    await this.prisma.$executeRaw<Review[]>`
      INSERT INTO Review (id, rating, comment, userId, productId) VALUES
      (${uuid}, ${createReviewDto.rating}, ${createReviewDto.comment}, ${createReviewDto.userId}, ${createReviewDto.productId})
    `
  }

  async deleteReviewByBuyer(id: string, me: string) {
    const reviewInfo = await this.getReviewById(id)
    if (reviewInfo.userId !== me) {
      throw new BadRequestException('You are not the owner of this review')
    }
    return await this.prisma.$executeRaw`DELETE FROM Review WHERE id = ${id}`
  }

  async deleteReviewByAdmin(id: string) {
    return await this.prisma.$executeRaw`DELETE FROM Review WHERE id = ${id}`
  }

  async updateReviewByAdmin(id: string, review: UpdateReviewDto) {
    const existReview = await this.prisma.$queryRaw<Review[]>`
        SELECT id FROM Review 
        WHERE id = ${id}
      `

    if (existReview.length < 0) {
      throw new BadRequestException("Review doesn't exist")
    }

    // old
    await this.prisma.$executeRaw<Review>`
        UPDATE \`Review\`
        SET rating = ${review.rating}, comment = ${review.comment}
        WHERE id = ${id}
      `

    // new
    // await this.prisma.review.update({
    //   where: {
    //     id,
    //   },
    //   data: {
    //     rating: review.rating,
    //     comment: review.comment,
    //   },
    // })

    return await this.getReviewById(id)
  }
}

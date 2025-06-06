import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Review } from './entities/review.entity'
import { CreateReviewDto } from './dto/create-review.dto'
import { UpdateReviewDto } from './dto/update-review.dto'
import { randomUUID } from 'crypto'
import { ReviewInfo } from './entities/review-info.entity'
import { ProductService } from 'src/product/product.service'
import { PrismaClient } from '@prisma/client'

type Order = PrismaClient['order']

@Injectable()
export class ReviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productService: ProductService,
  ) {}

  async getReviewsForSellerProduct(productId: string) {
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT 
        r.id,
        r.rating,
        r.comment,
        r.createdAt,
        r.updatedAt,
        u.username,
        u.email,
        p.name AS productName
      FROM \`Reviews\` r
      JOIN \`Products\` p ON r.productId = p.id
      JOIN User u ON r.userId = u.id
      WHERE r.productId = ${productId}
    `

    return result
  }

  async getRatingStats(productId: string) {
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT 
        r.rating,
        COUNT(*) AS count,
        ROUND(COUNT(*) * 100.0 / t.total, 0) AS percentage
      FROM \`Reviews\` r
      JOIN (
        SELECT COUNT(*) AS total
        FROM \`Reviews\`
        WHERE productId = ${productId}
      ) t
      ON 1=1
      WHERE r.productId = ${productId}
      GROUP BY r.rating, t.total
      ORDER BY r.rating DESC
    `

    const totalCount = result.reduce((sum, row) => sum + Number(row.count), 0)

    const averageResult = await this.prisma.$queryRaw<any[]>`
      SELECT ROUND(AVG(rating), 2) as average
      FROM \`Reviews\`
      WHERE productId = ${productId}
    `

    const average = averageResult[0]?.average ?? 0

    const breakdown: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    for (const row of result) {
      breakdown[row.rating] = row.percentage
    }

    return {
      average: Number(average),
      totalCount,
      breakdown,
    }
  }

  async getAllReview() {
    const result = await this.prisma.$queryRaw<Review[]>`
      SELECT *
      FROM \`Reviews\`
    `
    return result
  }

  async getReviewById(id: string) {
    const review = await this.prisma.$queryRaw<
      Review[]
    >`SELECT * FROM \`Reviews\` WHERE id = ${id}`

    if (!review || review.length === 0) {
      throw new NotFoundException('Review not found')
    }

    return review[0]
  }

  async getReviewInfo(productId: string) {
    const reviews = await this.prisma.$queryRaw<ReviewInfo[]>`
      SELECT R.id, R.rating, R.comment, R.userId, U.email, CONCAT(U.firstName, ' ', U.lastName) AS fullName, R.createdAt
      FROM \`Reviews\` R
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
      INSERT INTO Reviews (id, rating, comment, productId, userId)
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

    if (product.userId === createReviewDto.userId) {
      throw new BadRequestException('You cannot review your own product')
    }

    if (existingOrder.length === 0) {
      throw new BadRequestException("User haven't order this before")
    }

    if (
      existingReview.find((review) => review.userId === createReviewDto.userId)
    ) {
      throw new BadRequestException('You have already reviewed this product')
    }

    await this.prisma.$executeRaw<Review[]>`
      INSERT INTO Reviews (id, rating, comment, userId, productId) VALUES
      (${uuid}, ${createReviewDto.rating}, ${createReviewDto.comment}, ${createReviewDto.userId}, ${createReviewDto.productId})
    `
    return await this.getReviewById(uuid)
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
        SELECT id FROM \`Reviews\`
        WHERE id = ${id}
      `

    if (existReview.length < 0) {
      throw new BadRequestException("Review doesn't exist")
    }

    await this.prisma.$executeRaw<Review>`
        UPDATE \`Reviews\`
        SET rating = ${review.rating}, comment = ${review.comment}
        , updatedAt = CURRENT_TIMESTAMP
        WHERE id = ${id}
      `

    return await this.getReviewById(id)
  }
}

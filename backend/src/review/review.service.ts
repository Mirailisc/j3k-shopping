import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Review } from './entities/review.entity'
import { CreateReviewDto } from './dto/create-review.dto'
import { UpdateReviewDto } from './dto/update-review.dto'
import { User } from 'src/user/entities/user.entity'
import { randomUUID } from 'crypto'

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllReview() {
    const reviews = await this.prisma.$queryRaw<Review[]>`
      SELECT *
      FROM Review
    `

    return reviews.map((review) => ({
      ...review,
    }))
  }
}

import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Review } from './entities/review.entity'
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { randomUUID } from 'crypto'
import { Order } from '@prisma/client';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}
  
  async getAllReview() {
    const result = await this.prisma.$queryRaw<Review[]>`
      SELECT *
      FROM Review
    `
    return result
  }

  async getReviewById(id: string){
    const review = await this.prisma.$queryRaw<Review[]>
      `SELECT * FROM REVIEW WHERE id = ${id}`
    
    if(!review || review.length === 0){
      throw new Error('Review not found')
    }

    return review[0]
  }

  async getReviewByProductId(id: string){
    const review = await this.prisma.$queryRaw<Review[]>
      `SELECT * FROM REVIEW WHERE prudctId = ${id}`

    return review
  }

  async getReviewByUserId(id: string){
    const review = await this.prisma.$queryRaw<Review[]>
      `SELECT * FROM REVIEW WHERE userId = ${id}`

    return review
  }

  async createReviewByBuyer(review: CreateReviewDto, me:string){
    const uuid =randomUUID()
    const existingOrder = await this.prisma.$queryRaw<Order[]>
  `  SELECT id 
    FROM \`Order\` o
    WHERE o.productId = ${review.productId} 
    AND o.userId = ${review.userId}
    `

    if(!existingOrder || existingOrder.length === 0){
      throw new Error("You have not order this product yet!")
    }

    if(existingOrder[0].userId !== me ){
      throw new Error("You can not review did product.")
    }
    return await this.prisma.$executeRaw<Review[]> `
      INSERT INTO Review (id, rating, comment, userId, productId) VALUES
      (${uuid}, ${review.rating}, ${review.comment}, ${review.userId}, ${review.productId})
    `

  }

  async createReviewByAdmin(review: CreateReviewDto){
    const uuid = randomUUID()
    const existingOrder = await this.prisma.$queryRaw<Order[]>
      `SELECT id
      FROM \`Order\` o
      WHERE o.userId = ${review.userId} AND o.productId = ${review.productId}
    `
    if (!existingOrder || existingOrder.length === 0) {
      throw new BadRequestException("User haven't order this before")
    }

    await this.prisma.$executeRaw<Review[]>
      `INSERT INTO Review (id, rating, comment, userId, productId) VALUES
      (${uuid}, ${review.rating}, ${review.comment}, ${review.userId}, ${review.productId})
    `
  }

  async deleteReviewByBuyer(id:string, me:string) {
    const reviewInfo = await this.getReviewById(id)
    if(reviewInfo.userId !== me){
      throw new BadRequestException("You are not the owner of this review")
    }
    return await this.prisma.$executeRaw
      `DELETE FROM Review WHERE id = ${id}`
    
  }

  async deleteReviewByAdmin(id:string) {
    return await this.prisma.$executeRaw
      `DELETE FROM Review WHERE id = ${id}`
    
  }

  async updateReviewByBuyer(id:string, review: UpdateReviewDto, me: string ){
    const reviewInfo = await this.getReviewById(id)
    if(reviewInfo.userId !== me) {
      throw new BadRequestException("You are not the owner of this review")
    }

    await this.prisma.$executeRaw<Review[]>
      `UPDATE Review
      SET rating = ${review.rating}, comment = ${review.comment}
      WHERE id = ${id}`
    
    return await this.getReviewById(id)
  }

  async updateReviewByAdmin(id:string, review: UpdateReviewDto){
      const existReview = await this.prisma.$queryRaw<Review[]>
        `SELECT id FROM Review 
        WHERE id = ${id}`
      
      if (!existReview || existReview.length === 0) {
        throw new BadRequestException("Review doesn't exist")
      }

      await this.prisma.$executeRaw<Review>`
        UPDATE Review SET 
        rating = ${review.rating}, comment = ${review.comment}
        WHERE id = ${id}
      `
      return await this.getReviewById(id)
  }
  
}
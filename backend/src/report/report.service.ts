import {
  Injectable,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'


@Injectable()
export class ReportService {

  constructor(
  private readonly prisma: PrismaService
  ){}
   
  async getReviewedUsers() {
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT usr.id AS id, usr.username AS username, 
             COUNT(review.rating) AS reviews_amount, 
             AVG(review.rating) AS average_rating
      FROM user usr
      JOIN review
      ON (usr.id, review.id) IN (
        SELECT prd.userId, rev.id
        FROM product prd
        JOIN review rev ON prd.id = rev.productId
      )
      GROUP BY usr.id
      ORDER BY reviews_amount DESC, average_rating DESC
    `
    if (result.length === 0) return null;

    return result.map((row) => ({
      id: row.id.toString(),
      username: row.username,
      reviews_amount: Number(row.reviews_amount),
      average_rating: Number(row.average_rating),
    }));
  }

  async getRefundedUsers() {
    const result = await this.prisma.$queryRaw<any[]>`
    SELECT  u.id, u.username, 
            SUM(o.status = 'Refunded') as refunded_amount, 
            AVG(o.status = 'Refunded') * 100 as refunded_percentage
    FROM product p
    JOIN \`order\` o ON o.productId = p.id
    JOIN user u ON p.userId = u.id
    GROUP BY u.id
    HAVING refunded_amount > 0                            
    ORDER BY refunded_amount DESC, refunded_percentage DESC                                     
    `

    if(result.length === 0) return null;
    return result.map((row) => ({
      id: row.id.toString(),
      username: row.username,
      refunded_amount: Number(row.refunded_amount),
      refunded_percentage: Number(row.refunded_percentage),
    }));
  }

  async getHotProducts() { 
    const result = await this.prisma.$queryRaw<any[]>`
    SELECT p.name, SUM(o.amount) as sales FROM 
    \`order\` o join product p
    ON o.productId = p.id
    WHERE o.createdAt <= NOW() AND o.createdAt >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
      AND o.status = 'Completed'
    GROUP BY p.id
    HAVING sales > 0
    ORDER BY sales DESC
    LIMIT 5
    `
    if (result.length === 0) return null;

    return result.map((row) => ({
      name: row.name,
      value: Number(row.sales).toFixed(0),
      //total_revenue: Number(row.total_revenue).toFixed(2)

    }));
  }
}

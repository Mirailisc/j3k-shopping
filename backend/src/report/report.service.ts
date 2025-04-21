import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  async getReviewedUsers() {
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT usr.id AS id, usr.username AS username, 
             COUNT(r.rating) AS reviews_amount, 
             AVG(r.rating) AS average_rating
      FROM User usr
      JOIN Reviews r
      ON (usr.id, r.id) IN (
        SELECT prd.userId, rev.id
        FROM Product prd
        JOIN Reviews rev ON prd.id = rev.productId
      )
      GROUP BY usr.id
      ORDER BY reviews_amount DESC, average_rating DESC
    `

    return result.map((row) => ({
      id: row.id.toString(),
      username: row.username,
      reviews_amount: Number(row.reviews_amount),
      average_rating: Number(row.average_rating),
    }))
  }

  async getRefundedUsers() {
    const result = await this.prisma.$queryRaw<any[]>`
    SELECT  u.id, u.username, 
            SUM(o.status = 'Refunded') as refunded_amount, 
            AVG(o.status = 'Refunded') * 100 as refunded_percentage
    FROM Product p
    JOIN \`Order\` o ON o.productId = p.id
    JOIN User u ON p.userId = u.id
    GROUP BY u.id
    HAVING refunded_amount > 0                            
    ORDER BY refunded_amount DESC, refunded_percentage DESC                                     
    `

    return result.map((row) => ({
      id: row.id.toString(),
      username: row.username,
      refunded_amount: Number(row.refunded_amount),
      refunded_percentage: Number(row.refunded_percentage),
    }))
  }

  async getAverageSalesPrice() {
    const result = await this.prisma.$queryRaw<{ average_price: number }[]>`
      SELECT AVG(total) as average_price FROM
      \`Order\` o  LIMIT 1
    `
    return {
      price: result[0]?.average_price,
    }
  }

  async getHotProductSales(dataType: string, timePeriod: string) {
    const query =
      timePeriod === 'ALL TIME'
        ? this.prisma.$queryRawUnsafe<any[]>(`
          SELECT p.name, SUM(o.${dataType}) as total
          FROM \`Order\` o
          JOIN Product p ON o.productId = p.id
          WHERE o.status = 'Completed'
          GROUP BY p.id
          HAVING total > 0
          ORDER BY total DESC
        `)
        : this.prisma.$queryRawUnsafe<any[]>(`
          SELECT p.name, SUM(o.${dataType}) as total
          FROM \`Order\` o
          JOIN Product p ON o.productId = p.id
          WHERE o.status = 'Completed'
          AND o.createdAt >= DATE_SUB(NOW(), ${timePeriod})
          GROUP BY p.id
          HAVING total > 0
          ORDER BY total DESC
        `)

    const result = await query

    return result.map((row) => ({
      name: row.name,
      value: Number(row.total),
    }))
  }

  async getMonthlySales() {
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT 
        DATE_FORMAT(createdAt, "%M %Y") as month,
        DATE_FORMAT(createdAt, "%Y-%m") as sort_key,
        SUM(amount) as total_sales,
        SUM(total) as total_revenue
      FROM \`Order\`
      WHERE status = 'completed' 
        AND createdAt >= DATE_SUB(NOW(), interval 6 MONTH)
      GROUP BY month, sort_key
      ORDER BY sort_key DESC
    `
    return result.map((row) => ({
      month: row.month,
      sales: Number(row.total_sales),
      revenue: Number(row.total_revenue),
    }))
  }

  async getNewUserThisMonth() {
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT COUNT(id) as newuser FROM User
      UNION
      SELECT COUNT(id) as newuser FROM User
      WHERE createdAt < DATE_SUB(NOW(), INTERVAL 1 MONTH)
    `
    return result.map((row) => ({
      newUser: Number(row.newuser),
    }))
  }
}

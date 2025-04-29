import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { IMPORT_TAX_PERCENTAGE } from '../order/order.service';

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

  async getIncomeFromTaxes(timePeriod : string) {
    const rangeQuery = timePeriod !== 'ALL TIME' ? `AND createdAt >= DATE_SUB(NOW(), ${timePeriod})` : ``
    const result = await this.prisma.$queryRawUnsafe<any>(`
      SELECT (sum(total) - ROUND(sum(total) / (1+${IMPORT_TAX_PERCENTAGE}),2)) as total_income 
      FROM \`Order\` o  
      WHERE status = 'Completed'
      ${rangeQuery}
    `)
    return {
      price: result[0]?.total_income,
    }
  }

  async getHotProductSales(dataType: string, timePeriod: string) {
    const rangeQuery = timePeriod !== 'ALL TIME' ? `AND o.createdAt >= DATE_SUB(NOW(), ${timePeriod})` : ``
    const query =
        this.prisma.$queryRawUnsafe<any[]>(`
          SELECT p.name, SUM(o.${dataType}) as total
          FROM \`Order\` o
          JOIN Product p ON o.productId = p.id
          WHERE o.status = 'Completed'
          ${rangeQuery}
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

  async getStatusCount(timePeriod: string) {
    const rangeQuery = timePeriod !== 'ALL TIME' ? `WHERE o.createdAt >= DATE_SUB(NOW(), ${timePeriod})` : ``
    const query =
      this.prisma.$queryRawUnsafe<any[]>(`
        SELECT status, count(status) as total
        FROM \`Order\` o
        ${rangeQuery}
        GROUP BY status
        HAVING total > 0
        ORDER BY total DESC
      `)

    const result = await query
    return result.map((row)=> ({
      name: row.status,
      value: Number(row.total),
    }))
  }

  async getNewUser(timePeriod : string) {
    const rangeQuery = timePeriod !== 'ALL TIME' ? `WHERE createdAt < DATE_SUB(NOW(), ${timePeriod})` 
    : `WHERE createdAt > NOW()`
    const result = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT COUNT(id) as newuser FROM User
      UNION ALL
      SELECT COUNT(id) as newuser FROM User
      ${rangeQuery}
    `)
    return result.map((row) => ({
      newUser: Number(row.newuser),
    }))
  }

  async unsastisfyCustomer () {
    const result = await this.prisma.$queryRaw<any[]>`
           SELECT u.id as id, u.username as username, 
      COUNT(IF(r.rating <= 2,1, NULL)) as low_rating, AVG(rating) as avg_rating, 
      COUNT(IF(o.status = 'Refunded' , 1, NULL)) as refunded_count , COUNT(IF(o.status = 'Refunded' , 1, NULL)) * 100/COUNT(o.status)  as refunded_rate
      FROM User u 
      JOIN \`Order\` o ON o.userId = u.id
      LEFT JOIN Reviews r ON u.id = r.userId and o.productId = r.productId
      WHERE u.id IN (
          SELECT u.id FROM User u 
           	JOIN \`Order\` o ON o.userId = u.id
      		LEFT JOIN Reviews r ON u.id = r.userId and o.productId = r.productId
               WHERE (r.rating <= 2 AND o.status = 'Completed')
      		   OR (o.status = 'Refunded' or o.status = 'Refuding')
			)
      GROUP BY u.id
      ORDER BY refunded_rate DESC, low_rating DESC
    `

    return result.map((row) => ({
      id: row.id,
      username: row.username,
      low_rating: Number(row.low_rating),
      avg_rating: Number(row.avg_rating),
      refunded_count: Number(row.refunded_count),
      refunded_rate: Number(row.refunded_rate)
    }))
  }

  async UnsatisfyProduct(){
    const result = await this.prisma.$queryRaw<any[]>`
    SELECT p.id as id, p.name as name,
	  COUNT(IF(r.rating <= 2,1, NULL)) as low_rating, IFNULL(AVG(rating),0) as avg_rating, 
    COUNT(IF(o.status = 'Refunded' , 1, NULL)) as refunded_count , COUNT(IF(o.status = 'Refunded' , 1, NULL)) * 100/COUNT(o.status)  as refunded_rate
    FROM Product p
    JOIN \`Order\` o ON o.productId = p.id
    LEFT JOIN Reviews r ON p.id = r.productId
    WHERE p.id IN (
          SELECT p.id FROM Product p
         JOIN \`Order\` o ON o.productId = p.id
    	LEFT JOIN Reviews r ON p.id = r.productId
               WHERE (r.rating <= 2 AND o.status = 'Completed')
      		   OR (o.status = 'Refunded' or o.status = 'Refuding')
			)
    GROUP BY p.id
    ORDER BY refunded_rate DESC, low_rating DESC
  `

  return result.map((row) => ({
    id: row.id,
    name: row.name,
    low_rating: Number(row.low_rating),
    avg_rating: Number(row.avg_rating),
    refunded_count: Number(row.refunded_count),
    refunded_rate: Number(row.refunded_rate)
  }))
  }


}

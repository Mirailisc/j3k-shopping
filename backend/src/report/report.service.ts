import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { IMPORT_TAX_PERCENTAGE } from '../order/order.service'
import { Prisma } from '@prisma/client'
import { WrongTimePeriod } from './entities/TimePeriod'

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
        FROM \`Product\` prd
        JOIN Reviews rev ON prd.id = rev.productId
      )
      GROUP BY usr.id
      ORDER BY reviews_amount DESC, average_rating DESC
    `

    return result?.map((row) => ({
      id: row.id.toString(),
      username: row.username,
      reviews_amount: Number(row.reviews_amount),
      average_rating: Number(row.average_rating),
    }))
  }

  async getRefundedUsers() {
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT  
        u.id, 
        u.username, 
        SUM(CASE WHEN o.status = 'Refunded' THEN 1 ELSE 0 END) AS refunded_amount,
        SUM(CASE WHEN o.status = 'Refunded' THEN 1 ELSE 0 END) * 100.0 / COUNT(*) AS refunded_percentage
      FROM \`Product\` p
      JOIN \`Order\` o ON o.productId = p.id
      JOIN User u ON p.userId = u.id
      GROUP BY u.id
      HAVING refunded_amount > 0
      ORDER BY refunded_amount DESC, refunded_percentage DESC
    `

    return result?.map((row) => ({
      id: row.id.toString(),
      username: row.username,
      refunded_amount: Number(row.refunded_amount),
      refunded_percentage: Number(row.refunded_percentage),
    }))
  }

  async getIncomeFromTaxes(timePeriod: string) {
    const interval = Prisma.sql`${Prisma.raw(timePeriod)}`
    const result = await this.prisma.$queryRaw<any>`
      SELECT IFNULL((sum(total) - ROUND(sum(total) / (1 + ${IMPORT_TAX_PERCENTAGE}), 2)),0) AS total_income
      FROM \`Order\` o
      WHERE status = 'Completed'
         ${timePeriod === 'ALL TIME' || WrongTimePeriod(timePeriod) ? Prisma.empty : Prisma.sql`AND createdAt >= DATE_SUB(NOW(), ${interval})`}
    `
    return {
      price: result[0]?.total_income,
    }
  }

  async getHotProductSales(dataType: string, timePeriod: string) {
    const column = dataType === 'amount' ? 'amount' : 'total'
    const columnSql = `o.\`${column}\``

    const timeCondition =
      timePeriod === 'ALL TIME' || WrongTimePeriod(timePeriod)
        ? ''
        : `AND o.createdAt >= DATE_SUB(NOW(), INTERVAL ${timePeriod})`

    const rawQuery = `
      SELECT p.name, SUM(${columnSql}) as total
      FROM \`Order\` o
      JOIN \`Product\` p ON o.productId = p.id
      WHERE o.status = 'Completed'
      ${timeCondition}
      GROUP BY p.id
      HAVING total > 0
      ORDER BY total DESC
      LIMIT 8
    `

    const result = await this.prisma.$queryRawUnsafe<any[]>(rawQuery)

    return result.map((row) => ({
      name: row.name,
      value: Number(row.total),
    }))
  }

  async getStatusCount(timePeriod: string) {
    const interval = Prisma.sql`${Prisma.raw(timePeriod)}`
    const query = this.prisma.$queryRaw<any[]>`
        SELECT status, count(status) AS total
        FROM \`Order\` o
         ${timePeriod === 'ALL TIME' || WrongTimePeriod(timePeriod) ? Prisma.empty : Prisma.sql`WHERE createdAt >= DATE_SUB(NOW(), ${interval})`}
        GROUP BY status
        HAVING total > 0
        ORDER BY total DESC
      `

    const result = await query
    return result?.map((row) => ({
      name: row.status,
      value: Number(row.total),
    }))
  }

  async getNewUser(timePeriod: string) {
    const interval = Prisma.sql`${Prisma.raw(timePeriod)}`
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT IFNULL(COUNT(id),0) AS newuser FROM User
      UNION ALL
      SELECT IFNULL(COUNT(id),0) AS newuser FROM User
            ${timePeriod === 'ALL TIME' || WrongTimePeriod(timePeriod) ? Prisma.empty : Prisma.sql`WHERE createdAt < DATE_SUB(NOW(), ${interval})`}
    `
    return result?.map((row) => ({
      newUser: Number(row.newuser),
    }))
  }

  async unsastisfyCustomer() {
    const result = await this.prisma.$queryRaw<any[]>`
           SELECT u.id AS id, u.username AS username, 
      COUNT(IF(r.rating <= 2,1, NULL)) AS low_rating, AVG(rating) AS avg_rating, 
      COUNT(IF(o.status = 'Refunded' , 1, NULL)) AS refunded_count , COUNT(IF(o.status = 'Refunded' , 1, NULL)) * 100/COUNT(o.status)  AS refunded_rate
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

    return result?.map((row) => ({
      id: row.id,
      username: row.username,
      low_rating: Number(row.low_rating),
      avg_rating: Number(row.avg_rating),
      refunded_count: Number(row.refunded_count),
      refunded_rate: Number(row.refunded_rate),
    }))
  }

  async UnsastisfyProduct() {
    const result = await this.prisma.$queryRaw<any[]>`
    SELECT p.id AS id, p.name AS name,
	  COUNT(IF(r.rating <= 2,1, NULL)) AS low_rating, IFNULL(AVG(rating),0) AS avg_rating, 
    COUNT(IF(o.status = 'Refunded' , 1, NULL)) AS refunded_count , COUNT(IF(o.status = 'Refunded' , 1, NULL)) * 100/COUNT(o.status)  AS refunded_rate
    FROM \`Product\` p
    JOIN \`Order\` o ON o.productId = p.id
    LEFT JOIN Reviews r ON p.id = r.productId
    WHERE p.id IN (
          SELECT p.id FROM \`Product\` p
         JOIN \`Order\` o ON o.productId = p.id
    	LEFT JOIN Reviews r ON p.id = r.productId
               WHERE (r.rating <= 2 AND o.status = 'Completed')
      		   OR (o.status = 'Refunded' or o.status = 'Refuding')
			)
    GROUP BY p.id
    ORDER BY refunded_rate DESC, low_rating DESC
  `

    return result?.map((row) => ({
      id: row.id,
      name: row.name,
      low_rating: Number(row.low_rating),
      avg_rating: Number(row.avg_rating),
      refunded_count: Number(row.refunded_count),
      refunded_rate: Number(row.refunded_rate),
    }))
  }

  async getSellerRevenue(timePeriod: string, id: string) {
    const interval = Prisma.sql`${Prisma.raw(timePeriod)}`
    const result = await this.prisma.$queryRaw<any>`
      SELECT IFNULL(SUM(o.total),0) as revenue FROM \`Order\` o 
      JOIN \`Product\` p on p.id = o.productId
      WHERE p.userId = ${id} AND o.status = 'Completed'
      UNION ALL
      SELECT IFNULL(SUM(o.total),0) as revenue FROM \`Order\` o 
      JOIN \`Product\` p on p.id = o.productId
      WHERE p.userId = ${id} AND o.status = 'Completed'
      ${timePeriod === 'ALL TIME' || WrongTimePeriod(timePeriod) ? Prisma.empty : Prisma.sql`AND o.createdAt < DATE_SUB(NOW(), ${interval})`}
    `
    return result?.map((row) => ({
      revenue: Number(row.revenue),
    }))
  }

  async getSellerMostSalesProduct(
    dataType: string,
    timePeriod: string,
    id: string,
  ) {
    const interval = Prisma.sql`${Prisma.raw(timePeriod)}`
    const column =
      dataType === 'total' || dataType === 'amount'
        ? Prisma.sql`${Prisma.raw(dataType)}`
        : Prisma.sql`${Prisma.raw('total')}`
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT p.name as name, SUM(o.${column}) as sales FROM \`Order\` o 
      JOIN \`Product\` p on p.id = o.productId
      WHERE p.userId =  ${id} AND o.status = 'Completed'
       ${timePeriod === 'ALL TIME' || WrongTimePeriod(timePeriod) ? Prisma.empty : Prisma.sql`AND o.createdAt >= DATE_SUB(NOW(), ${interval})`}
      GROUP BY p.name
      ORDER BY sales DESC
      LIMIT 8
    `
    return result?.map((row) => ({
      name: row.name,
      value: Number(row.sales),
    }))
  }

  async getSellerUnsoldProductsList(timePeriod: string, id: string) {
    const interval = Prisma.sql`${Prisma.raw(timePeriod)}`
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT IFNULL(COUNT(p.name), 0) AS total FROM \`Product\` p
      WHERE p.userId = ${id} AND p.id not in
  	  (SELECT p.id as sales FROM \`Order\` o 
      RIGHT JOIN \`Product\` p on p.id = o.productId
      WHERE p.userId =  ${id} AND o.status = 'Completed'
      ${timePeriod === 'ALL TIME' || WrongTimePeriod(timePeriod) ? Prisma.empty : Prisma.sql`AND o.createdAt >= DATE_SUB(NOW(), ${interval})`}
      GROUP BY p.name)
    `
    return result?.map((row) => ({
      total: Number(row.total),
    }))
  }

  async getAverageSellerReview(id: string) {
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT IfNULL(AVG(rating),0) as average_rating 
      FROM \`Reviews\` r JOIN \`Product\` p
      ON r.productId = p.id
      WHERE p.userId = ${id}
      GROUP BY p.userId
    `
    return result?.map((row) => ({
      average_rating: Number(row.average_rating),
    }))
  }

  async getSellerStatusCount(timePeriod: string, id: string) {
    const interval = Prisma.sql`${Prisma.raw(timePeriod)}`
    const query = this.prisma.$queryRaw<any[]>`
        SELECT status, count(status) AS total
        FROM \`Order\` o
        JOIN \`Product\` p 
        ON p.id = o.productId
        WHERE p.userId = ${id}
         ${timePeriod === 'ALL TIME' || WrongTimePeriod(timePeriod) ? Prisma.empty : Prisma.sql`AND o.createdAt >= DATE_SUB(NOW(), ${interval})`}
        GROUP BY status
        HAVING total > 0
        ORDER BY total DESC
      `

    const result = await query
    return result?.map((row) => ({
      name: row.status,
      value: Number(row.total),
    }))
  }

  async getSellerProductStat(id: string) {
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT 
      p.name AS name,
      avg_rating,
      COUNT(CASE WHEN o.status = 'Completed' THEN 1 END) AS total_order,
      IFNULL(SUM(CASE WHEN o.status = 'Completed' THEN o.amount ELSE 0 END), 0) AS amount_sales,
      IFNULL(SUM(CASE WHEN o.status = 'Completed' THEN o.total ELSE 0 END), 0) AS revenue,
      IFNULL(
        COUNT(CASE WHEN o.status = 'Refunded' THEN 1 END) * 100.0 / NULLIF(COUNT(o.id), 0),
        0
      ) AS refunded_rate

    FROM \`Product\` p
    LEFT JOIN (
      SELECT productId, AVG(rating) AS avg_rating
      FROM \`Reviews\`
      GROUP BY productId
    ) r ON r.productId = p.id

    LEFT JOIN \`Order\` o ON o.productId = p.id
    WHERE p.userId = ${id}
    GROUP BY p.id, r.avg_rating
    ORDER BY revenue DESC, amount_sales DESC
  `

    return result?.map((row) => ({
      name: row.name,
      total_order: Number(row.total_order),
      revenue: Number(row.revenue),
      avg_rating: Number(row.avg_rating),
      amount_sales: Number(row.amount_sales),
      refunded_rate: Number(row.refunded_rate),
    }))
  }
}

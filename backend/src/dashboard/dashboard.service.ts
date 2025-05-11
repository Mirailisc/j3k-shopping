import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { validateRange } from './entities/rangeType'

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getAverageRating() {
    const result = await this.prisma.$queryRaw<number>`
      SELECT AVG(rating) AS res FROM \`Reviews\` 
    `
    return Number(result[0]?.res)
  }

  async getTotalOrders() {
    const result = await this.prisma.$queryRaw<number>`
      SELECT COUNT(id) AS res FROM \`Order\` 
    `
    return Number(result[0]?.res)
  }

  async getCustomerCount() {
    const result = await this.prisma.$queryRaw<number>`
      SELECT Count(DISTINCT userId) AS res FROM \`Order\` 
    `
    return Number(result[0]?.res)
  }

  async getTotalRevenue() {
    const result = await this.prisma.$queryRaw<number>`
      SELECT Sum(total) AS res FROM \`Order\` 
    `
    return Number(result[0]?.res)
  }

  async RatingCount() {
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT r.rating AS rating, 
             COUNT(*) AS count
      FROM \`Reviews\` r
      WHERE r.rating IS NOT NULL
      GROUP BY r.rating
      ORDER BY r.rating DESC
    `

    return result?.map((row) => ({
      name: Number(row.rating),
      value: Number(row.count),
    }))
  }

  async getSellerTotalOrder(id: string) {
    const result = await this.prisma.$queryRaw<any>`
      SELECT count(o.id) as total FROM \`Order\` o
      JOIN \`Products\` p ON o.productId = p.id 
      WHERE p.userId = ${id} and status = 'Completed'
    `
    return Number(result[0]?.total)
  }

  async getSellerTotalSales(id: string) {
    const result = await this.prisma.$queryRaw<any>`
      SELECT SUM(o.amount) as total FROM \`Order\` o
      JOIN \`Products\` p ON o.productId = p.id
      WHERE p.userId = ${id} and status = 'Completed'
    `
    return Number(result[0]?.total)
  }

  async OnPendingOrder(id: string) {
    const result = await this.prisma.$queryRaw<any>`
      SELECT COUNT(o.id) as total FROM \`Order\` o
      JOIN \`Products\` p ON o.productId = p.id
      WHERE p.userId = ${id} and status = 'Pending'
    `
    return Number(result ? result[0].total : 0)
  }

  async LowStockProduct(id: string) {
    const result = await this.prisma.$queryRaw<any>`
      SELECT COUNT(id) AS total FROM \`Products\` 
      WHERE quantity <= 5 and userId = ${id}
      GROUP BY userId
    `
    return result.length > 0 ? Number(result[0]?.total) : 0
  }

  async getLowStockList(id: string) {
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT id, name, quantity FROM \`Products\` 
      WHERE quantity <= 5 and userId = ${id}
      
    `
    return result?.map((row) => ({
      id: row.id,
      name: row.name,
      quantity: Number(row.quantity),
    }))
  }
  async GetSalesOverTimeAdmin(range: string) {
    const validRange = validateRange(range);
    enum Range {
      'DAY' = '%d',
      'MONTH' = '%M-%Y',
      'WEEK' = '%v',
      'YEAR' = '%y',
    }
    const result = await this.prisma.$queryRaw<any[]>`
      WITH RECURSIVE times AS (
        SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 5 ${Prisma.raw(validRange)}), '%Y-%m-%d') AS time_start
        UNION ALL
        SELECT DATE_ADD(time_start, INTERVAL 1 ${Prisma.raw(validRange)})
        FROM times
        WHERE time_start < DATE_FORMAT(CURDATE(), '%Y-%m-%d')
      )
      SELECT 
        DATE_FORMAT(m.time_start, ${Range[validRange]}) AS \`range\`,
        IFNULL(SUM(o.total), 0) AS revenue,
        IFNULL(SUM(o.amount), 0) AS totalSales
      FROM times m
      LEFT JOIN \`Order\` o ON ${Prisma.raw(validRange)}(o.createdAt) = ${Prisma.raw(validRange)}(m.time_start)
      LEFT JOIN Products p ON p.id = o.productId
      GROUP BY m.time_start
      ORDER BY m.time_start
    `

    return result?.map((row) => ({
      range: row.range.toString(),
      revenue: Number(row.revenue),
      sales: Number(row.totalSales),
    }))
  } 


 async GetSalesOverTime(range: string, id: string) {
  const validRange = validateRange(range);
    enum Range {
      'DAY' = '%d',
      'MONTH' = '%M-%Y',
      'WEEK' = '%v',
      'YEAR' = '%y',
    }
    const result = await this.prisma.$queryRaw<any[]>`
      WITH RECURSIVE times AS (
        SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 5 ${Prisma.raw(validRange)}), '%Y-%m-%d') AS time_start
        UNION ALL
        SELECT DATE_ADD(time_start, INTERVAL 1 ${Prisma.raw(validRange)})
        FROM times
        WHERE time_start < DATE_FORMAT(CURDATE(), '%Y-%m-%d')
      )
      SELECT 
        DATE_FORMAT(m.time_start, ${Range[validRange]}) AS \`range\`,
        IFNULL(SUM(IF(p.userId = ${id}, o.total, NULL)),0) AS revenue,
        IFNULL(SUM(IF(p.userId = ${id}, o.amount, NULL)),0) AS totalSales
      FROM times m
      LEFT JOIN \`Order\` o ON ${Prisma.raw(validRange)}(o.createdAt) = ${Prisma.raw(validRange)}(m.time_start)
      LEFT JOIN Products p ON p.id = o.productId
      GROUP BY m.time_start
      ORDER BY m.time_start
    `

    return result?.map((row) => ({
      range: row.range.toString(),
      revenue: Number(row.revenue),
      sales: Number(row.totalSales),
    }))
  }

}

import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getAverageRating() {
    const result = await this.prisma.$queryRaw<number>`
      SELECT AVG(rating) as res FROM \`Reviews\` 
    `
    return Number(result[0]?.res)
  }

  async getTotalOrders() {
    const result = await this.prisma.$queryRaw<number>`
      SELECT COUNT(id) as res FROM \`Order\` 
    `
    return Number(result[0]?.res)
  }

  async getCustomerCount() {
    const result = await this.prisma.$queryRaw<number>`
      SELECT Count(DISTINCT userId) as res FROM \`Order\` 
    `
    return Number(result[0]?.res)
  }

  async getTotalRevenue() {
    const result = await this.prisma.$queryRaw<number>`
      SELECT Sum(total) as res FROM \`Order\` 
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

    return result.map((row) => ({
      name: Number(row.rating),
      value: Number(row.count),
    }))
  }

  async getSellerTotalOrder(id: string) {
    const result = await this.prisma.$queryRaw<any>`
      SELECT count(o.id) as total FROM \`Order\` o
      JOIN Product p ON o.productId = p.id 
      WHERE p.userId = ${id} and status = 'Completed'
    `
    return Number(result[0]?.total)
  }

  async getSellerTotalSales(id: string) {
    const result = await this.prisma.$queryRaw<any>`
      SELECT SUM(o.amount) as total FROM \`Order\` o
      JOIN Product p ON o.productId = p.id
      WHERE p.userId = ${id} and status = 'Completed'
    `
    return Number(result[0]?.total)
  }

  async OnPendingOrder(id: string) {
    const result = await this.prisma.$queryRaw<any>`
      SELECT COUNT(o.id) as total FROM \`Order\` o
      JOIN Product p ON o.productId = p.id
      WHERE p.userId = ${id} and status = 'Pending'
    `
    return Number(result ? result[0].total : 0)
  }

  async LowStockProduct(id: string) {
    const result = await this.prisma.$queryRaw<any>`
      SELECT COUNT(id) as total FROM \`Product\` 
      WHERE quantity <= 5 and userId = ${id}
      GROUP BY userId
    `
    return Number(result ? result[0].total : 0)
  }

  async getLowStockList(id: string) {
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT id, name, quantity FROM \`Product\` 
      WHERE quantity <= 5 and userId = ${id}
      
    `
    return result.map((row) => ({
      id: row.id,
      name: row.name,
      quantity: Number(row.quantity),
    }))
  }
  async GetSalesOverTimeAdmin(range: string) {
    enum Range {
      'DAY' = '%d',
      'MONTH' = '%M-%Y',
      'WEEK' = '%v',
      'YEAR' = '%y',
    }
    const query = `
      WITH RECURSIVE times AS (
        SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 5 ${range}), '%Y-%m-%d') AS time_start
        UNION ALL
        SELECT DATE_ADD(time_start, INTERVAL 1 ${range})
        FROM times
        WHERE time_start < DATE_FORMAT(CURDATE(), '%Y-%m-%d')
      )
      SELECT 
        DATE_FORMAT(m.time_start, '${Range[range]}') AS \`range\`,
        IFNULL(SUM(o.total), 0) AS revenue,
        IFNULL(SUM(o.amount), 0) AS totalSales
      FROM times m
      LEFT JOIN \`Order\` o ON ${range}(o.createdAt) = ${range}(m.time_start)
      LEFT JOIN product p ON p.id = o.productId
      GROUP BY m.time_start
      ORDER BY m.time_start
    `

    const result = await this.prisma.$queryRawUnsafe<any[]>(query)

    return result.map((row) => ({
      range: row.range.toString(),
      revenue: Number(row.revenue),
      sales: Number(row.totalSales),
    }))
  }

  async GetSalesOverTime(range: string, id: string) {
    enum Range {
      'DAY' = '%d',
      'MONTH' = '%M-%Y',
      'WEEK' = '%v',
      'YEAR' = '%y',
    }
    const query = `
      WITH RECURSIVE times AS (
        SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 5 ${range}), '%Y-%m-%d') AS time_start
        UNION ALL
        SELECT DATE_ADD(time_start, INTERVAL 1 ${range})
        FROM times
        WHERE time_start < DATE_FORMAT(CURDATE(), '%Y-%m-%d')
      )
      SELECT 
        DATE_FORMAT(m.time_start, '${Range[range]}') AS \`range\`,
        IFNULL(SUM(IF(p.userId = '${id}', o.total, NULL)),0) AS revenue,
        IFNULL(SUM(IF(p.userId = '${id}', o.amount, NULL)),0) AS totalSales
      FROM times m
      LEFT JOIN \`Order\` o ON ${range}(o.createdAt) = ${range}(m.time_start)
      LEFT JOIN product p ON p.id = o.productId
      GROUP BY m.time_start
      ORDER BY m.time_start
    `

    const result = await this.prisma.$queryRawUnsafe<any[]>(query)

    return result.map((row) => ({
      range: row.range.toString(),
      revenue: Number(row.revenue),
      sales: Number(row.totalSales),
    }))
  }
}

import { Injectable } from '@nestjs/common'
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
 async GetSalesOverTimeAdmin() {
  const result = await this.prisma.$queryRaw<any[]>`
    SELECT 
      DATE(o.createdAt) AS orderDate,
      IFNULL(SUM(o.total), 0) AS revenue,
      IFNULL(SUM(o.amount), 0) AS totalSales
    FROM \`Order\` o
    GROUP BY DATE(o.createdAt)
    ORDER BY orderDate DESC
    LIMIT 10
  `

  return result.reverse().map((row) => {
    const date = new Date(row.orderDate);
    const range = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: '2-digit',
    });

    return {
      range,
      revenue: Number(row.revenue),
      sales: Number(row.totalSales),
    };
  });
}

 async GetSalesOverTime(id: string) {
  const result = await this.prisma.$queryRaw<any[]>`
    SELECT 
      DATE(o.createdAt) AS orderDate,
      IFNULL(SUM(o.total), 0) AS revenue,
      IFNULL(SUM(o.amount), 0) AS totalSales
    FROM \`Order\` o JOIN Products p 
    ON p.id = o.productId
    WHERE p.userId = ${id}
    GROUP BY DATE(o.createdAt)
    ORDER BY orderDate DESC
    LIMIT 10
  `

  return result.reverse().map((row) => {
    const date = new Date(row.orderDate);
    const range = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: '2-digit',
    });

    return {
      range,
      revenue: Number(row.revenue),
      sales: Number(row.totalSales),
    };
  });
}
}
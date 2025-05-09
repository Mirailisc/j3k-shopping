import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async CountryTotalOrder() {
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT c.country AS country, 
             SUM(o.total) AS total
      FROM Contact c
      JOIN User u ON c.userId = u.id
      JOIN \`Order\` o ON o.userId = u.id
      WHERE o.status = 'Completed'
        AND c.country IS NOT NULL
      GROUP BY c.country
      ORDER BY total DESC
    `;

    return result.map(row => ({
      country: row.country,
      total: Number(row.total),
    }));
  }

  async RatingAmount() {
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT r.rating AS rating, 
             SUM(o.amount) AS total_amount
      FROM Reviews r
      JOIN \`Order\` o 
        ON r.productId = o.productId 
       AND r.userId = o.userId
      WHERE r.rating IS NOT NULL
      GROUP BY r.rating
      ORDER BY r.rating DESC
    `;

    return result.map(row => ({
      rating: Number(row.rating),
      total_amount: Number(row.total_amount),
    }));
  }

  async RatingCount() {
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT r.rating AS rating, 
             COUNT(*) AS count
      FROM Reviews r
      WHERE r.rating IS NOT NULL
      GROUP BY r.rating
      ORDER BY r.rating DESC
    `;

    return result.map(row => ({
      rating: Number(row.rating),
      count: Number(row.count),
    }));
  }

  async RefundedProductName() {
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT p.name AS product_name, 
             COUNT(*) AS refunded_count
      FROM \`Order\` o
      JOIN Product p ON o.productId = p.id
      WHERE o.status = 'Refunded'
      GROUP BY p.name
      ORDER BY refunded_count DESC
      LIMIT 5
    `;
  
    return result.map(row => ({
      product_name: row.product_name,
      refunded_count: Number(row.refunded_count),
  }))
}
/* eslint-disable @typescript-eslint/no-magic-numbers */

  async getSellerTotalOrder(id: string){
    const result = await this.prisma.$queryRaw<any>`
      SELECT count(o.id) as total FROM \`Order\` o
      JOIN Product p ON o.productId = p.id
      WHERE p.userId = ${id}
    `
    return Number(result[0]?.total);
  }

  async getSellerTotalSales(id: string){
    const result = await this.prisma.$queryRaw<any>`
      SELECT SUM(o.amount) as total FROM \`Order\` o
      JOIN Product p ON o.productId = p.id
      WHERE p.userId = ${id}
    `
    return Number(result[0]?.total);
  }

  async OnPendingOrder(id: string){
    const result = await this.prisma.$queryRaw<any>`
      SELECT COUNT(o.id) as total FROM \`Order\` o
      JOIN Product p ON o.productId = p.id
      WHERE p.userId = ${id} and status = 'Pending'
    `
    return Number(result ? result[0].total: 0);
  }

  async LowStockProduct(id: string){
    const result = await this.prisma.$queryRaw<any>`
      SELECT COUNT(id) as total FROM product 
      WHERE quantity <= 5 and userId = ${id}
      GROUP BY userId
    `
    return Number(result ? result[0].total: 0);
  }

  async getLowStockList(id: string){
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT id, name, quantity FROM product 
      WHERE quantity <= 5 and userId = ${id}
      
    `
    return result.map((row) => ({
      id: row.id,
      name: row.name,
      quantity: Number(row.quantity)
    }))
  }

  async GetSalesOverTime(range: string, id: string){
    enum Range{
      'DAY'= '%d',
      'MONTH' = '%M-%Y',
      'WEEK' = '%v',
      'YEAR' = '%y'
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
      WHERE p.userId = ?
        OR p.id IS NULL
      GROUP BY m.time_start
      ORDER BY m.time_start
    `;

    const result = await this.prisma.$queryRawUnsafe<any[]>(query, id);

    return result.map((row) => ({
      range: row.range.toString(),
      revenue: Number(row.revenue),
      sales: Number(row.totalSales),
    }));
  }
}

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
    }));
  }
}

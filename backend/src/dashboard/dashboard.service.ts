import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

// Country total orders grouped by country
  async CountryTotalOrder() {
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT c.country AS country, SUM(o.total) AS total
      FROM Contact c
      JOIN User u ON c.userId = u.id
      JOIN \`Order\` o ON o.userId = u.id
      GROUP BY c.country
      HAVING total > 0
      ORDER BY total DESC
    `;

    return result.map((row) => ({
      name: row.country ?? "Unknown",
      value: Number(row.total),
    }));
  }

  // Rating distribution 0-5 stars
  async RatingCount() {
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT r.rating AS rating, COUNT(*) AS count
      FROM Reviews r
      GROUP BY r.rating
      ORDER BY r.rating ASC
    `;

    const counts = Array.from({ length: 6 }, (_, i) => {
      const match = result.find((r) => r.rating === i);
      return { star: i, count: match ? Number(match.count) : 0 };
    });

    return counts.map((row) => ({
      name: `${row.star} Star`,
      value: row.count,
    }));
  }

  // Total number of users
  async UserCount() {
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT COUNT(*) AS count FROM User
    `;
    return { count: Number(result[0]?.count || 0) };
  }

  // Total number of products
  async ProductCount() {
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT COUNT(*) AS count FROM Product
    `;
    return { count: Number(result[0]?.count || 0) };
  }

  // Sum of all products in stock
  async ProductInStock() {
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT SUM(p.quantity) AS stock FROM Product p
    `;
    return { stock: Number(result[0]?.stock || 0) };
  }

  // Average rating
  async AvgRating() {
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT AVG(r.rating) AS average FROM Reviews r
    `;
    return { average: Number(result[0]?.average || 0).toFixed(2) };
  }
}

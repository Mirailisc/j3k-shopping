import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Product } from './entities/product.entity'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllProduct() {
    return await this.prisma.$queryRaw<Product[]>`
      SELECT * FROM Product
    `
  }

  async getProductById(id: string) {
    const product = await this.prisma.$queryRaw<Product[]>`
      SELECT * FROM Product WHERE id = ${id}
    `

    if (product.length === 0) {
      throw new Error('Product not found')
    }

    return product[0]
  }

  async getProductBySellerId(sellerId: string) {
    return await this.prisma.$queryRaw<Product[]>`
      SELECT * FROM Product WHERE userId = ${sellerId}
    `
  }

  async searchProductByName(name: string) {
    return await this.prisma.$queryRaw<Product[]>`
      SELECT * FROM Product WHERE name LIKE ${name}
    `
  }

  async createProduct(product: CreateProductDto) {
    return await this.prisma.$queryRaw<Product[]>`
      INSERT INTO Product (name, productImg, description, price, quantity, userId)
      VALUES (${product.name}, ${product.productImg}, ${product.description}, ${product.price}, ${product.quantity}, ${product.userId})
      RETURNING *
    `
  }

  async updateProductBySeller(
    id: string,
    product: UpdateProductDto,
    me: string,
  ) {
    const productInfo = await this.getProductById(id)

    if (productInfo.userId !== me) {
      throw new Error('You are not the owner of this product')
    }

    return await this.prisma.$queryRaw<Product[]>`
      UPDATE Product
      SET name = ${product.name}, productImg = ${product.productImg}, description = ${product.description}, price = ${product.price}, quantity = ${product.quantity}
      WHERE id = ${id}
      RETURNING *
    `
  }

  async updateProductByAdmin(id: string, product: UpdateProductDto) {
    return await this.prisma.$queryRaw<Product[]>`
      UPDATE Product
      SET name = ${product.name}, productImg = ${product.productImg}, description = ${product.description}, price = ${product.price}, quantity = ${product.quantity}
      WHERE id = ${id}
      RETURNING *
    `
  }

  async deleteProductBySeller(id: string, me: string) {
    const product = await this.getProductById(id)

    if (product.userId !== me) {
      throw new Error('You are not the owner of this product')
    }

    await this.prisma.$executeRaw`
      DELETE FROM OrderItem WHERE productId = ${id}
    `

    await this.prisma.$executeRaw`
      DELETE FROM Review WHERE productId = ${id}
    `

    return await this.prisma.$executeRaw`
      DELETE FROM Product WHERE id = ${id}
    `
  }

  async deleteProductByAdmin(id: string) {
    await this.prisma.$executeRaw`
      DELETE FROM OrderItem WHERE productId = ${id}
    `

    await this.prisma.$executeRaw`
      DELETE FROM Review WHERE productId = ${id}
    `

    return await this.prisma.$executeRaw`
      DELETE FROM Product WHERE id = ${id}
    `
  }
}

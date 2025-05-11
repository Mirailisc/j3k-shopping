import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Product } from './entities/product.entity'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { User } from 'src/user/entities/user.entity'
import { randomUUID } from 'crypto'

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  private toBase64(imageData: string | Uint8Array | Buffer): string {
    let buffer: Buffer

    if (typeof imageData === 'string') {
      buffer = Buffer.from(imageData, 'base64')
    } else if (Buffer.isBuffer(imageData)) {
      buffer = imageData
    } else {
      buffer = Buffer.from(imageData)
    }
    return `data:image/jpeg;base64,${buffer.toString('base64')}`
  }

  async getAllProduct() {
    const products = await this.prisma.$queryRaw<Product[]>`
      SELECT *
      FROM \`Product\`
    `

    return products.map((product) => ({
      ...product,
      productImg: this.toBase64(product.productImg),
    }))
  }

  async getProductById(id: string) {
    const product = await this.prisma.$queryRaw<Product[]>`
      SELECT *
      FROM \`Product\`
      WHERE id = ${id}
    `

    if (!product || product.length === 0) {
      throw new NotFoundException('Product not found')
    }

    const productData = product[0]

    return {
      ...productData,
      productImg: this.toBase64(productData.productImg),
    }
  }

  async getProductInfo(id: string) {
    const product = await this.prisma.$queryRaw<Product[]>`
      SELECT P.id, P.name, P.productImg, P.description, P.price, P.quantity, U.username AS seller,P.createdAt
      FROM \`Product\` P
      LEFT JOIN User U ON P.userId = U.id
      WHERE P.id = ${id}
    `

    if (!product || product.length === 0) {
      throw new NotFoundException('Product not found')
    }

    const productData = product[0]

    return {
      ...productData,
      productImg: this.toBase64(productData.productImg),
    }
  }

  async getProductBySellerId(sellerId: string) {
    const products = await this.prisma.$queryRaw<Product[]>`
      SELECT *
      FROM \`Product\`
      WHERE userId = ${sellerId}
    `

    return products.map((product) => ({
      ...product,
      productImg: product.productImg ? this.toBase64(product.productImg) : null,
    }))
  }

  async createProductBySeller(
    product: Omit<CreateProductDto, 'userId'>,
    sellerId: string,
  ) {
    const uuid = randomUUID()
    await this.prisma.$executeRaw<Product[]>`
      INSERT INTO Product (id, name, productImg, description, price, quantity, userId)
      VALUES (${uuid}, ${product.name}, ${product.productImg}, ${product.description}, ${product.price}, ${product.quantity}, ${sellerId})
    `

    return await this.getProductById(uuid)
  }

  async createProductByAdmin(product: CreateProductDto) {
    const uuid = randomUUID()
    const existingUser = await this.prisma.$queryRaw<User[]>`
      SELECT id
      FROM User
      WHERE id = ${product.userId}
    `

    if (!existingUser || existingUser.length === 0) {
      throw new BadRequestException('User not found')
    }

    await this.prisma.$executeRaw<Product[]>`
      INSERT INTO Product (id, name, productImg, description, price, quantity, userId)
      VALUES (${uuid}, ${product.name}, ${product.productImg}, ${product.description}, ${product.price}, ${product.quantity}, ${product.userId})
    `

    return await this.getProductById(uuid)
  }

  async updateProductBySeller(
    id: string,
    product: UpdateProductDto,
    me: string,
  ) {
    const productInfo = await this.getProductById(id)

    if (productInfo.userId !== me) {
      throw new BadRequestException('You are not the owner of this product')
    }
    await this.prisma.$executeRaw<Product[]>`
      UPDATE Product
      SET name = ${product.name}, description = ${product.description}, price = ${product.price}, quantity = ${product.quantity}
      , updatedAt = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `
    if (product.productImg) {
      await this.prisma.$executeRaw<Product[]>`
      UPDATE Product
      SET  productImg = ${product.productImg}
      WHERE id = ${id}
    `
    }

    return await this.getProductById(id)
  }

  async updateProductByAdmin(id: string, product: UpdateProductDto) {
    await this.prisma.$executeRaw<Product[]>`
      UPDATE Product
      SET name = ${product.name}, description = ${product.description}, price = ${product.price}, quantity = ${product.quantity}
      , updatedAt = CURRENT_TIMESTAMP
      WHERE id = ${id}
      
    `
    if (product.productImg) {
      await this.prisma.$executeRaw<Product[]>`
        UPDATE Product
        SET  productImg = ${product.productImg}
        WHERE id = ${id}
      `
    }
    return await this.getProductById(id)
  }

  async deleteProductBySeller(id: string, me: string) {
    const product = await this.getProductById(id)

    if (product.userId !== me) {
      throw new BadRequestException('You are not the owner of this product')
    }

    await this.prisma.$executeRaw`
      DELETE FROM \`Reviews\` WHERE productId = ${id}
    `

    return await this.prisma.$executeRaw`
      DELETE FROM \`Product\` WHERE id = ${id}
    `
  }

  async deleteProductByAdmin(id: string) {
    await this.prisma.$executeRaw`
      DELETE FROM \`Reviews\` WHERE productId = ${id}
    `

    return await this.prisma.$executeRaw`
      DELETE FROM \`Product\` WHERE id = ${id}
    `
  }
}

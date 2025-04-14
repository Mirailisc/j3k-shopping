import { Controller, Get, Param, Post } from '@nestjs/common'
import { FeedService } from './feed.service'

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get('stats')
  async stats() {
    return await this.feedService.stats()
  }

  @Get('products')
  async allProductFeed() {
    return await this.feedService.allProductFeed()
  }

  @Get('products/recent')
  async recentProductFeed() {
    return await this.feedService.recentProductFeed()
  }

  @Post('search/:name')
  async searchProductsByName(@Param('name') name: string) {
    return await this.feedService.searchProductsByName(name)
  }
}

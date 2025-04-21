import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common'
import { ProfileService } from './profile.service'
import { AuthGuard } from '@nestjs/passport'
import { UpdateContactDto } from 'src/contact/dto/update-contact.dto'

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() req) {
    return await this.profileService.getProfile(req.user.userId)
  }

  @Get('shipping-info')
  @UseGuards(AuthGuard('jwt'))
  async getShippingInfo(@Request() req) {
    return await this.profileService.getShippingInfo(req.user.userId)
  }

  @Put('shipping-info')
  @UseGuards(AuthGuard('jwt'))
  async updateShippingInfo(
    @Request() req,
    @Body() info: UpdateContactDto & { firstName: string; lastName: string },
  ) {
    return await this.profileService.updateShippingInfo(req.user.userId, info)
  }

  @Get(':username')
  @UseGuards(AuthGuard('jwt'))
  async getProfileByUsername(@Param('username') username: string) {
    return await this.profileService.getProfileByUsername(username)
  }
}

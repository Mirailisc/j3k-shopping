import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common'
import { SocialService } from './social.service'
import { AuthGuard } from '@nestjs/passport'
import { AdminGuard } from 'src/auth/admin.guard'
import { SuperAdminGuard } from 'src/auth/super-admin.guard'
import { UpdateSocialDto } from './dto/update-social.dto'

@Controller('social')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getSocials() {
    return await this.socialService.getSocials()
  }

  @Put('admin/:id')
  @UseGuards(AuthGuard('jwt'), SuperAdminGuard)
  async adminEditSocial(
    @Param('id') id: string,
    @Body() contact: UpdateSocialDto,
  ) {
    return await this.socialService.editSocial(id, contact)
  }

  @Put('user/:id')
  async userEditSocial(@Body() contact: UpdateSocialDto, @Request() req) {
    return await this.socialService.editSocial(req.user.userId, contact)
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard('jwt'))
  async getContactByUser(@Param('userId') userId: string) {
    return await this.socialService.getSocialByUser(userId)
  }
}

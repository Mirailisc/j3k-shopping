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
import { UpdateSocialDto } from './dto/update-social.dto'
import { ApiParam } from '@nestjs/swagger'

@Controller('social')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Get('user/:username')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'username', description: 'Username' })
  async getContactByUsername(@Param('username') username: string) {
    return await this.socialService.getSocialByUsername(username)
  }

  @Put('me')
  @UseGuards(AuthGuard('jwt'))
  async userEditSocial(@Body() contact: UpdateSocialDto, @Request() req) {
    return await this.socialService.updateSocial(req.user.userId, contact)
  }
}

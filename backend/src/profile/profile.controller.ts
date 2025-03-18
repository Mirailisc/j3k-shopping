import { Controller, Get, Request, UseGuards } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { AuthGuard } from '@nestjs/passport'

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() req) {
    return await this.profileService.getProfile(req.user.userId)
  }
}

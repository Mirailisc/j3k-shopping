import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { ApiBody, ApiParam } from '@nestjs/swagger'
import { AdminGuard } from 'src/auth/admin.guard'
import { SuperAdminGuard } from 'src/auth/super-admin.guard'
import { AuthGuard } from '@nestjs/passport'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), SuperAdminGuard)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto)
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getAllUser() {
    return await this.userService.getAllUser()
  }

  @Get(':username')
  @UseGuards(AuthGuard('jwt'))
  async getUserByUsername(@Param('username') username: string) {
    return await this.userService.getUserByUsername(username)
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), SuperAdminGuard)
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: CreateUserDto, description: 'Update user data' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: Omit<CreateUserDto, 'password'>,
  ) {
    return await this.userService.updateUser(id, updateUserDto)
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), SuperAdminGuard)
  @ApiParam({ name: 'id', description: 'User ID' })
  async deleteUser(@Param('id') id: string, @Request() req) {
    return await this.userService.deleteUser(id, req.user.userId)
  }

  @Put(':id/reset-password')
  @UseGuards(AuthGuard('jwt'), SuperAdminGuard)
  @ApiParam({ name: 'id', description: 'User ID' })
  async resetPassword(
    @Param('id') id: string,
    @Body() resetPasswordDto: { current: string; newPassword: string },
  ) {
    return await this.userService.resetPassword(
      id,
      resetPasswordDto.current,
      resetPasswordDto.newPassword,
    )
  }
}

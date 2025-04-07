import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common'
import { ContactService } from './contact.service'
import { AuthGuard } from '@nestjs/passport'
import { UpdateContactDto } from './dto/update-contact.dto'
import { ApiParam } from '@nestjs/swagger'

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get('/user/:username')
  @ApiParam({ name: 'username', description: 'Username' })
  async getContactByUsername(@Param('username') username: string) {
    return await this.contactService.getContactByUsername(username)
  }

  @Put('me')
  @UseGuards(AuthGuard('jwt'))
  async updateContact(@Body() contact: UpdateContactDto, @Request() req) {
    return await this.contactService.updateContact(req.user.userId, contact)
  }
}

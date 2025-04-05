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
import { AdminGuard } from 'src/auth/admin.guard'
import { SuperAdminGuard } from 'src/auth/super-admin.guard'
import { UpdateContactDto } from './dto/update-contact.dto'

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getContacts() {
    return await this.contactService.getContacts()
  }

  @Put('admin/:id')
  @UseGuards(AuthGuard('jwt'), SuperAdminGuard)
  async adminEditContact(
    @Param('id') id: string,
    @Body() contact: UpdateContactDto,
  ) {
    return await this.contactService.editContact(id, contact)
  }

  @Put('user/:id')
  async userEditContact(@Body() contact: UpdateContactDto, @Request() req) {
    return await this.contactService.editContact(req.user.userId, contact)
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard('jwt'))
  async getContactByUser(@Param('userId') userId: string) {
    return await this.contactService.getContactByUser(userId)
  }
}

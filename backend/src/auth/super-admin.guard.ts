import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common'
import { UserService } from 'src/user/user.service'

@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const { userId } = request.user

    const user = await this.userService.getUserById(userId)

    if (user && user.isSuperAdmin) {
      return true
    }

    throw new ForbiddenException('Access denied. Super Admins only.')
  }
}

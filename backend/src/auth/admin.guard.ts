import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common'
import { UserService } from 'src/user/user.service'

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const { userId } = request.user

    const user = await this.userService.getUserById(userId)

    if (user && user.isAdmin) {
      return true
    }

    throw new ForbiddenException('Access denied. Admins only.')
  }
}

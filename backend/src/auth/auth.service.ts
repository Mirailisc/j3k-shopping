import { Injectable, UnauthorizedException } from '@nestjs/common'
import { RegisterDto } from './dto/register.dto'
import { UserService } from 'src/user/user.service'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    try {
      const user = await this.userService.getUserByUsername(username)
      const isPasswordMatch = await bcrypt.compare(password, user.password)

      if (user && isPasswordMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user
        return result
      } else {
        throw new UnauthorizedException('Incorrect username or password')
      }
    } catch {
      throw new UnauthorizedException('Incorrect username or password')
    }
  }

  async login(loginDto: LoginDto) {
    const { id, username, email, firstName, lastName, isAdmin, isSuperAdmin } =
      await this.validateUser(loginDto.username, loginDto.password)

    const payload = { username: loginDto.username, sub: id }
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        username,
        email,
        firstName,
        lastName,
        isAdmin,
        isSuperAdmin,
      },
    }
  }

  async register(registerDto: RegisterDto) {
    return await this.userService.createUser({
      ...registerDto,
      isAdmin: false,
      isSuperAdmin: false,
      line: '',
      facebook: '',
      instagram: '',
      tiktok: '',
      website: '',
    })
  }

  async me(userId: string) {
    const data = await this.userService.getUserById(userId)
    return {
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      isAdmin: data.isAdmin,
      isSuperAdmin: data.isSuperAdmin,
    }
  }
}

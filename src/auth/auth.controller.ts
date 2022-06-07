import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { RegisterDTO } from 'src/user/register.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { Roles } from './decorators/roles.decorator';
import { LoginDTO } from './login.dto';
import { Role } from './models/role.enum';
import { RolesGuard } from './roles.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) { }

  @Get("/onlyauth")
  @UseGuards(AuthGuard("jwt"))
  async hiddenInformation(@Request() req) {
    return req.user;
  }

  @Get("/userDetail")
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  async userDetail() {
    return await this.userService.userDetail();
  }

  @Get("/getUserDetail")
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.USER,)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  async getUserDetail() {
    return await this.userService.getUserDetail();
  }

  @Post('register')
  async register(@Body() registerDTO: RegisterDTO) {
    const user = await this.userService.create(registerDTO);
    if (user) {
      return "User Created Successfully!";
    } else {
      return "Something wnt Wrong"
    }
  };

  @Post('login')
  async login(@Body() loginDTO: LoginDTO) {
    const user = await this.userService.findByLogin(loginDTO);
    const payload = {
      email: user.email,
    };
    const token = await this.authService.signPayload(payload);
    return { token };
  }
}


import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { RegisterDTO } from 'src/user/register.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LoginDTO } from './login.dto';

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
  @UseGuards(AuthGuard("jwt"))
  async userDetail(@Request() req) {
    if (req.user.role === 'super admin') {
      return await this.userService.userDetail();
    }
    if (req.user.role === 'admin') {
      return await this.userService.specificDetailOfUser();
    } else {
      if (req.user.role === 'user') {
        return await this.userService.getUser();
      } else {
        return "Something went Wrong!"
      }
    }
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

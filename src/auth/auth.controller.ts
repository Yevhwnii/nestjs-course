import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authCredDto: AuthCredentialsDto,
  ): Promise<{ message: string }> {
    return this.authService.signUp(authCredDto);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredDto);
  }

  //   @Post('/test')
  //   // Guard can be applied either to controller or to route
  //   // Using guards, we will receive user entity in req added thru password
  //   @UseGuards(AuthGuard())
  //   test(@GetUser() user: User) {
  //     console.log(user);
  //   }
}

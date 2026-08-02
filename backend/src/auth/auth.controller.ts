import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  Ip,
  Headers,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Public, CurrentUser, CurrentUserType } from '../common/decorators/auth.decorator';
import {
  RegisterCustomerDto,
  RegisterWorkerDto,
  LoginDto,
  RefreshDto,
  SendOtpDto,
  VerifyOtpDto,
} from './dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register/customer')
  @ApiOperation({ summary: 'Register a new customer account' })
  @ApiResponse({ status: 201, description: 'Customer registered successfully' })
  @ApiResponse({ status: 409, description: 'Phone or email already registered' })
  async registerCustomer(
    @Body() dto: RegisterCustomerDto,
    @Res({ passthrough: true }) res: Response,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const result = await this.authService.registerCustomer(dto, ip, userAgent);
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieDomain = process.env.COOKIE_DOMAIN;
    
    const refreshToken = await this.authService.generateRefreshTokenForCookie(result.user.id);
    
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 30 * 24 * 3600 * 1000,
      path: '/',
      domain: cookieDomain || undefined,
    });
    return result;
  }

  @Public()
  @Post('register/worker')
  @ApiOperation({ summary: 'Register a new worker / professional account' })
  @ApiResponse({ status: 201, description: 'Worker registered, pending verification' })
  async registerWorker(
    @Body() dto: RegisterWorkerDto,
    @Res({ passthrough: true }) res: Response,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const result = await this.authService.registerWorker(dto, ip, userAgent);
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieDomain = process.env.COOKIE_DOMAIN;
    
    const refreshToken = await this.authService.generateRefreshTokenForCookie(result.user.id);
    
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 30 * 24 * 3600 * 1000,
      path: '/',
      domain: cookieDomain || undefined,
    });
    return result;
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with phone or email + password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const result = await this.authService.login(dto, ip, userAgent);
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieDomain = process.env.COOKIE_DOMAIN;
    
    // Generate refresh token separately for cookie storage
    const refreshToken = await this.authService.generateRefreshTokenForCookie(result.user.id);
    
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 30 * 24 * 3600 * 1000,
      path: '/',
      domain: cookieDomain || undefined,
    });
    return result;
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  async refresh(
    @Body() dto: RefreshDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refresh = dto.refreshToken || (req.cookies?.refresh_token as string);
    const result = await this.authService.refresh(refresh);
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieDomain = process.env.COOKIE_DOMAIN;
    
    const newRefreshToken = await this.authService.generateRefreshTokenForCookie(result.userId);
    
    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 30 * 24 * 3600 * 1000,
      path: '/',
      domain: cookieDomain || undefined,
    });
    return { accessToken: result.accessToken };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Logout current session (or all)' })
  async logout(
    @CurrentUser() user: CurrentUserType,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: { all?: boolean } = {},
  ) {
    const refresh = body.all ? undefined : (req.cookies?.refresh_token as string);
    const result = await this.authService.logout(user.id, refresh);
    const cookieDomain = process.env.COOKIE_DOMAIN;
    
    res.clearCookie('refresh_token', {
      path: '/',
      domain: cookieDomain || undefined,
    });
    return result;
  }

  @Public()
  @Post('otp/send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send phone OTP via SMS (stubbed)' })
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendPhoneOtp(dto.phone);
  }

  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify phone OTP and mark phone as verified' })
  async verifyOtp(@CurrentUser() user: CurrentUserType, @Body() dto: VerifyOtpDto) {
    return this.authService.verifyPhoneOtp(user.id, dto.otp);
  }
}

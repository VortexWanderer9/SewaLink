import { Injectable, UnauthorizedException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { RegisterCustomerDto, RegisterWorkerDto, LoginDto } from './dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private auditService: AuditService,
  ) {}

  async registerCustomer(dto: RegisterCustomerDto, ip?: string, userAgent?: string) {
    const normalizedPhone = this.normalizePhone(dto.phone);
    if (!this.validateNepaliPhone(normalizedPhone)) {
      throw new BadRequestException('Invalid Nepali phone number format');
    }

    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ phone: normalizedPhone }, dto.email ? { email: dto.email.toLowerCase() } : {}] },
    });
    if (existing) throw new ConflictException('Phone or email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.$transaction(async (tx) => {
      const u = await tx.user.create({
        data: {
          role: Role.CUSTOMER,
          phone: normalizedPhone,
          email: dto.email?.toLowerCase() || null,
          passwordHash,
          fullName: dto.fullName.trim(),
          isPhoneVerified: false,
          isEmailVerified: false,
          customerProfile: { create: { referralCode: this.generateReferralCode(dto.fullName) } },
        },
        include: { customerProfile: true },
      });

      if (dto.address) {
        await tx.address.create({
          data: {
            userId: u.id,
            label: dto.address.label || 'Home',
            fullAddress: dto.address.fullAddress,
            city: dto.address.city,
            district: dto.address.district,
            ward: dto.address.ward,
            isDefault: true,
            phone: normalizedPhone,
            instructions: dto.address.instructions,
          },
        });
      }

      return u;
    });

    await this.auditService.log('REGISTER_CUSTOMER', 'USER', user.id, null, { phone: normalizedPhone }, ip, userAgent);
    this.logger.log(`Customer registered: ${user.id}`);

    return this.buildAuthResponse(user, Role.CUSTOMER);
  }

  async registerWorker(dto: RegisterWorkerDto, ip?: string, userAgent?: string) {
    const normalizedPhone = this.normalizePhone(dto.phone);
    if (!this.validateNepaliPhone(normalizedPhone)) {
      throw new BadRequestException('Invalid Nepali phone number format');
    }

    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ phone: normalizedPhone }, dto.email ? { email: dto.email.toLowerCase() } : {}] },
    });
    if (existing) throw new ConflictException('Phone or email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.$transaction(async (tx) => {
      const u = await tx.user.create({
        data: {
          role: Role.WORKER,
          phone: normalizedPhone,
          email: dto.email?.toLowerCase() || null,
          passwordHash,
          fullName: dto.fullName.trim(),
          isPhoneVerified: false,
          isEmailVerified: false,
          workerProfile: {
            create: {
              categorySlug: dto.categorySlug,
              bio: dto.bio || '',
              yearsExperience: dto.yearsExperience || 0,
              priceFrom: dto.priceFrom || 0,
              location: dto.location,
              verificationStatus: 'PENDING',
            },
          },
        },
        include: { workerProfile: true },
      });

      for (let d = 0; d < 7; d++) {
        await tx.availability.create({
          data: { workerProfileId: u.workerProfile!.id, dayOfWeek: d, startTime: '08:00', endTime: '19:00', isAvailable: d !== 0 },
        });
      }

      return u;
    });

    await this.auditService.log('REGISTER_WORKER', 'USER', user.id, null, { category: dto.categorySlug }, ip, userAgent);
    this.logger.log(`Worker registered: ${user.id} (${dto.categorySlug})`);

    return this.buildAuthResponse(user, Role.WORKER, user.workerProfile!.verificationStatus);
  }

  async login(dto: Login, ip?: string, userAgent?: string) {
    const normalizedPhone = dto.phone ? this.normalizePhone(dto.phone) : null;
    const user = await this.prisma.user.findFirst({
      where: dto.phone ? { phone: normalizedPhone! } : { email: dto.email?.toLowerCase() },
      include: { workerProfile: { select: { id: true, verificationStatus: true } } },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!user.isActive) throw new UnauthorizedException('Account is disabled');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const accessToken = await this.generateAccessToken(user.id, user.role);
    const refreshToken = await this.generateRefreshToken(user.id);
    await this.prisma.refreshToken.create({
      data: { userId: user.id, token: refreshToken, expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000) },
    });

    await this.auditService.log('LOGIN', 'USER', user.id, null, null, ip, userAgent);
    this.logger.log(`User logged in: ${user.id} (${user.role})`);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        role: user.role,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        verificationStatus: user.workerProfile?.verificationStatus,
        workerProfileId: user.workerProfile?.id,
      },
    };
  }

  async refresh(refreshTokenStr: string) {
    const stored = await this.prisma.refreshToken.findFirst({
      where: { token: refreshTokenStr, revokedAt: null, expiresAt: { gt: new Date() } },
    });
    if (!stored) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.prisma.user.findUnique({ where: { id: stored.userId } });
    if (!user || !user.isActive) throw new UnauthorizedException('Invalid user');

    await this.prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } });
    const newAccess = await this.generateAccessToken(user.id, user.role);
    const newRefresh = await this.generateRefreshToken(user.id);
    await this.prisma.refreshToken.create({
      data: { userId: user.id, token: newRefresh, expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000) },
    });

    return { accessToken: newAccess, refreshToken: newRefresh };
  }

  async logout(userId: string, refreshTokenStr?: string) {
    if (refreshTokenStr) {
      await this.prisma.refreshToken.updateMany({
      where: { userId, token: refreshTokenStr },
      data: { revokedAt: new Date() },
    });
    } else {
      await this.prisma.refreshToken.updateMany({
      where: { userId },
      data: { revokedAt: new Date() },
    });
    }
    this.logger.log(`User logged out: ${userId}`);
    return { message: 'Logged out successfully' };
  }

  async sendPhoneOtp(_phone: string) {
    return { message: 'OTP sent (stub - integrate with Sparrow SMS / SMS Without Borders' };
  }

  async verifyPhoneOtp(userId: string, _otp: string) {
    await this.prisma.user.update({ where: { id: userId }, data: { isPhoneVerified: true } });
    return { verified: true };
  }

  private async buildAuthResponse(user: any, role: Role, verificationStatus?: string) {
    const accessToken = await this.generateAccessToken(user.id, role);
    const refreshToken = await this.generateRefreshToken(user.id);
    await this.prisma.refreshToken.create({
      data: { userId: user.id, token: refreshToken, expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000) },
    });
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        role,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        verificationStatus,
        workerProfileId: user.workerProfile?.id,
      },
    };
  }

  private async generateAccessToken(userId: string, role: Role) {
    return this.jwtService.signAsync(
      { sub: userId, role, type: 'access' },
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d', secret: process.env.JWT_SECRET },
    );
  }

  private async generateRefreshToken(userId: string) {
    return this.jwtService.signAsync(
      { sub: userId, type: 'refresh' },
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d', secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET },
    );
  }

  private normalizePhone(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('977')) return `+${digits}`;
    if (digits.length === 10 && digits.startsWith('9')) return `+977${digits}`;
    return `+977${digits}`;
  }

  private validateNepaliPhone(phone: string): boolean {
    return /^\+9779[6-9]\d{8}$/.test(phone);
  }

  private generateReferralCode(name: string): string {
    const initials = name.split(' ').map(s => s[0]).join('').toUpperCase().slice(0, 3);
    return `${initials}${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  }
}

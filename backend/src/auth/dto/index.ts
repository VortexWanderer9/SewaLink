import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  IsNotEmpty,
  IsInt,
  IsPositive,
  IsObject,
  ValidateNested,
  IsPhoneNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';

export class AddressDto {
  @ApiProperty() @IsString() @IsNotEmpty() label: string;
  @ApiProperty() @IsString() @IsNotEmpty() fullAddress: string;
  @ApiProperty() @IsString() @IsNotEmpty() city: string;
  @ApiProperty() @IsString() @IsNotEmpty() district: string;
  @ApiPropertyOptional() @IsString() @IsOptional() ward?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() instructions?: string;
}

export class RegisterCustomerDto {
  @ApiProperty({ example: 'Ram Bahadur Thapa' })
  @IsString() @IsNotEmpty() @MinLength(2)
  fullName: string;

  @ApiProperty({ example: '9800000000' })
  @IsString() @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ example: 'ram@email.com' })
  @IsEmail() @IsOptional()
  email?: string;

  @ApiProperty({ example: 'SecurePass123', minLength: 8 })
  @IsString() @MinLength(8)
  password: string;

  @ApiPropertyOptional({ type: AddressDto })
  @IsObject() @ValidateNested() @Type(() => AddressDto) @IsOptional()
  address?: AddressDto;
}

export class RegisterWorkerDto {
  @ApiProperty({ example: 'Bishnu Shrestha' })
  @IsString() @IsNotEmpty() @MinLength(2)
  fullName: string;

  @ApiProperty({ example: '9810000000' })
  @IsString() @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ example: 'bishnu@email.com' })
  @IsEmail() @IsOptional()
  email?: string;

  @ApiProperty({ example: 'WorkerPass123', minLength: 8 })
  @IsString() @MinLength(8)
  password: string;

  @ApiProperty({ example: 'electrician' })
  @IsString() @IsNotEmpty()
  categorySlug: string;

  @ApiProperty({ example: 'Lalitpur — Jawalakhel' })
  @IsString() @IsNotEmpty()
  location: string;

  @ApiPropertyOptional({ example: '15+ years of industrial and residential wiring.' })
  @IsString() @IsOptional()
  bio?: string;

  @ApiPropertyOptional({ example: 15 })
  @IsInt() @IsPositive() @IsOptional()
  yearsExperience?: number;

  @ApiPropertyOptional({ example: 500 })
  @IsInt() @IsPositive() @IsOptional()
  priceFrom?: number;
}

export class LoginDto {
  @ApiPropertyOptional({ example: '9800000000' })
  @IsString() @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'admin@sewalinknepal.com' })
  @IsEmail() @IsOptional()
  email?: string;

  @ApiProperty({ example: 'Admin@123' })
  @IsString() @IsNotEmpty()
  password: string;
}

export class RefreshDto {
  @ApiPropertyOptional({ description: 'Optional, uses httpOnly cookie if not provided' })
  @IsString() @IsOptional()
  refreshToken?: string;
}

export class SendOtpDto {
  @ApiProperty({ example: '9800000000' })
  @IsString() @IsNotEmpty()
  phone: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: '123456' })
  @IsString() @IsNotEmpty()
  otp: string;
}

import { Role } from '../types';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsEnum(Role)
  role: Role;

  @IsString()
  @Length(5, 30)
  name: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  @Length(9, 9)
  nif: string;

  @IsString()
  @Length(5, 30)
  @IsOptional()
  address: string;

  @IsString()
  @Length(1, 30)
  @IsOptional()
  country: string;

  @IsString()
  @Length(5, 100)
  @IsOptional()
  obs: string;
}

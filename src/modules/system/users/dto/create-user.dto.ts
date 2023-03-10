import { BaseDtoClass } from '@shared/base/dto/base-dto.class';
import { UserRoles } from './../enum/roles.enums';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  Matches,
  IsString,
  IsArray,
  ArrayContains,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateUserDto extends BaseDtoClass {
  // Name
  @ApiProperty({ example: 'user name' })
  @IsString()
  name: string;

  // Email
  @ApiProperty({ example: 'user@mail.com' })
  @IsEmail()
  email: string;

  // Password
  @ApiProperty({ example: 'password123' })
  @Matches(/^.{6,}$/, { message: 'Password at least 6' })
  password: string;

  // Confirm password
  @ApiProperty({ example: 'password123' })
  @Matches(/^.{6,}$/, { message: 'Password at least 6' })
  confirmPassword: string;

  // Role
  @ApiProperty({
    isArray: true,
    example: ['user', 'admin'],
  })
  @IsArray()
  @ArrayContains(['user', 'admin'])
  @ArrayNotEmpty()
  roles: UserRoles[];
}

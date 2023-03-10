import { bcryptOptions } from '@shared/options/bcrypt.options';
import { errors } from '@shared/exceptions/errors';
import { ChangePasswordDto } from './dto/change-password-dto';
import { ObjectId } from 'mongoose';
import { IUser } from './../users/interfaces/user.interface';
import { UsersService } from './../users/users.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { IUserJWT } from './interfaces/jwt-user';
import { MailService } from '../mail/mail.service';
import {RegisterNewUserDto} from "@src/modules/system/auth/dto/register-new-user.dto";
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private mailService: MailService    
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.getByEmail(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(userLogin) {
    console.log(process.env.UPLOADS_PATH)
    const user = await this.usersService.getByEmail(userLogin.email);
    if (user) {
      const isPassCorrect = await compare(userLogin.password, user.password);
      if (isPassCorrect) {
        return {
          jwtBearerToken:
            /*  'Bearer ' + */
            this.jwtService.sign({
              _id: user._id,
              email: user.email,
              roles: user.roles,
            }),
        };
      } else {
        throw errors.invalidEmailOrPassword;
      }
    } else {
      throw errors.invalidEmailOrPassword;
    }
  }

  async register(user: RegisterNewUserDto) {
    const { password, ...createdUser } = await this.usersService.create(user);
    //send mail
    await this.mailService.sendUserConfirmation(user, "token");
    return createdUser;
  }

  profile(id: ObjectId) {
    return this.usersService.getById(id);
  }

  async changePassword(authUser: IUserJWT, incomePasswords: ChangePasswordDto) {
    if (incomePasswords.newPassword !== incomePasswords.confirmNewPassword) {
      throw errors.invalidNewPassConfirmation;
    } else {
      const user = await this.usersService.getByEmail(authUser.email);
      if (user) {
        const isValidOldPassword = await compare(
          incomePasswords.oldPassword,
          user.password,
        );
        if (isValidOldPassword) {
          const hashedPassword = await hash(
            incomePasswords.newPassword,
            bcryptOptions.rounds,
          );
          return await this.usersService.changePassword(authUser._id, {
            password: hashedPassword,
          });
        } else {
          throw errors.invalidPassword;
        }
      } else {
        throw errors.invalidPassword;
      }
    }
  }
}

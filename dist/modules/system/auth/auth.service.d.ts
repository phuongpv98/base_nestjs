import { ChangePasswordDto } from './dto/change-password-dto';
import { ObjectId } from 'mongoose';
import { IUser } from './../users/interfaces/user.interface';
import { UsersService } from './../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUserJWT } from './interfaces/jwt-user';
import { MailService } from '../mail/mail.service';
export declare class AuthService {
    private readonly jwtService;
    private readonly usersService;
    private mailService;
    constructor(jwtService: JwtService, usersService: UsersService, mailService: MailService);
    validateUser(username: string, pass: string): Promise<{
        _id?: string;
        name: string;
        email: string;
        roles: string[];
    }>;
    login(userLogin: any): Promise<{
        jwtBearerToken: string;
    }>;
    register(user: IUser): Promise<{
        _id?: string;
        name: string;
        email: string;
        roles: string[];
    }>;
    profile(id: ObjectId): Promise<import("../users/classes/user").User>;
    changePassword(authUser: IUserJWT, incomePasswords: ChangePasswordDto): Promise<import("../users/classes/user").User>;
}

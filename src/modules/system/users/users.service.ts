import { bcryptOptions } from '@shared/options/bcrypt.options';
import { constants } from '@shared/constants/constants';
import { errors } from '@shared/exceptions/errors';
import { User } from './classes/user';
import { IChangePassword } from './../auth/interfaces/change-password';
import { IUser } from './interfaces/user.interface';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { hash } from 'bcryptjs';
import { RegisterNewUserDto } from '@src/modules/system/auth/dto/register-new-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<IUser>,
  ) {
    this.createAdminIfNotExists();

    // userModel.createMapping((err, mapping) => {
    //   console.log({ err, mapping });
    // });
  }

  async create(user: RegisterNewUserDto): Promise<User> {
    try {
      return (await this.userModel.create(user))._doc();
    } catch (err) {
      throw new HttpException(`Callback getUser ${err.message}`, 400);
    }

  }

  async update(id: ObjectId, user: IUser): Promise<User> {
    if (user.password) {
      delete user.password;
    }
    const updatedUser = await this.userModel
      .findOneAndUpdate({ _id: id }, { $set: user }, { new: true })
      .lean();
    if (updatedUser) {
      return updatedUser;
      // const { password, ...finalUserObj } = updatedUser;
      // return finalUserObj;
    } else {
      throw errors.documentNotFound;
    }
  }

  async changePassword(
    id: ObjectId,
    newPassword: IChangePassword,
  ): Promise<User> {
    const changedPasswordUser = await this.userModel
      .findOneAndUpdate({ _id: id }, { $set: newPassword }, { new: true })
      .lean();
    if (changedPasswordUser) {
      return changedPasswordUser;
      // const { password, ...finalUserObj } = changedPasswordUser;
      // return finalUserObj;
    } else {
      throw errors.documentNotFound;
    }
  }

  async getById(id: ObjectId): Promise<User> {
    const userExisted = await this.userModel
      .findOne({
        _id: id,
      })
      .lean();

    if (userExisted) {
      return userExisted;
      // const { password, ...user } = userExisted;
      // return user;
    } else {
      throw errors.documentNotFound;
    }
  }

  async delete(id: ObjectId): Promise<User> {
    const userDeleted = await this.userModel
      .findOneAndDelete({ _id: id })
      .lean();
    if (userDeleted) {
      throw errors.deletedSuccessfully;
    } else {
      throw errors.documentNotFound;
    }
  }

  async getByEmail(email): Promise<User> {
    return await this.userModel.findOne({ email }).lean();
  }

  async getAll(): Promise<User[]> {
    return await(this.userModel.find({})).lean();
  }

  async createAdminIfNotExists() {
    const adminExists = await this.userModel
      .findOne({
        email: new RegExp(constants.admin.email),
      })
      .lean();
    if (!adminExists) {
      const password = await hash(
        constants.admin.password,
        bcryptOptions.rounds,
      );
      await this.userModel.create({
        name: constants.admin.name,
        email: constants.admin.email,
        password,
        roles: constants.admin.roles,
      });
      Logger.log('Admin account created', 'Custom-Log');
    }
  }
}

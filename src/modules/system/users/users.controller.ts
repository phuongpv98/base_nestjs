import { DeleteFieldsInterceptor } from '@shared/interceptors/delete-fields.interceptor';
import { RolesGuard } from '@shared/guards/roles.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import {
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '@shared/decorators/roles.decorator';
import { ObjectId } from 'mongoose';
import { IUser } from '@src/modules/system/users/interfaces/user.interface';
import { RegisterNewUserDto } from '@src/modules/system/auth/dto/register-new-user.dto';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
@UseInterceptors(new DeleteFieldsInterceptor('password'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({
    summary: 'Create user',
    description: 'End-Point for create user',
  })
  // @ApiResponse({
  //   status: 201,
  //   description: 'The record has been successfully created.',
  // })
  // @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createdUserDto: RegisterNewUserDto) {
    return this.usersService.create(createdUserDto);
  }

  @Get()
  @Roles('admin')
  @ApiOperation({
    summary: 'Get all users',
    description: 'End-Point for get all users',
  })
  findAll() {
    return this.usersService.getAll();
  }

  @Get(':_id')
  @Roles('admin')
  @ApiOperation({
    summary: 'Get user by id',
    description: 'End-Point for get user by id',
  })
  getById(@Param('_id') id: ObjectId) {
    return this.usersService.getById(id);
  }

  @Delete(':_id')
  @Roles('admin')
  @ApiOperation({
    summary: 'Delete user by id',
    description: 'End-Point for delete user by id',
  })
  delete(@Param('_id') id: ObjectId) {
    return this.usersService.delete(id);
  }

  @Put(':_id')
  @Roles('admin')
  @ApiOperation({
    summary: 'Update user by id',
    description: 'End-Point for update user by id',
  })
  update(@Param('_id') id: ObjectId, @Body() updateUserDto: IUser) {
    return this.usersService.update(id, updateUserDto);
  }
}

import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userMapper: Repository<UserEntity>,
  ) {}
  async login(createUserDto: CreateUserDto) {
    const user = await this.userMapper.findOne({
      where: {
        phone: createUserDto.phone,
      },
    });
    if (!user) {
      return '用户不存在';
    }
    if (user.password !== createUserDto.password) {
      return '密码错误';
    }
    return user;
  }
}

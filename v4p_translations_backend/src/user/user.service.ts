import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}


  async create(dto: CreateUserDto): Promise<User> {
    const entity = this.userRepository.create(dto);
    return this.userRepository.save(entity);
  }

  async findByEmailOrCreate(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      return this.create({ email });
    }
    return user;
  }

}

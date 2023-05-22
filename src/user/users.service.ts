import { Injectable } from '@nestjs/common';
import { UserClass } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserFormDto } from './dto/user-form.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserClass)
    private usersRepository: Repository<UserClass>,
  ) {}

  async findAll(): Promise<UserClass[]> {
    return await this.usersRepository.find();
  }

  async findOneById(id: number): Promise<UserClass> {
    return await this.usersRepository.findOneBy({ id: id });
  }

  async findOneByOuterId(id: string): Promise<UserClass> {
    return await this.usersRepository.findOneBy({ outerId: id });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async getCount() {
    const users = await this.usersRepository.find();
    return users.length;
  }

  async save(user: UserClass) {
    await this.usersRepository.save(user);
  }

  async create(user: UserFormDto, outerId: string) {
    const userEntity = new UserClass(outerId, user.username);
    await this.save(userEntity);
  }

  async delete(id: number) {
    const userEntity = await this.usersRepository.findOne({
      where: { id: id },
    });
    userEntity.isActive = false;
    await this.save(userEntity);
  }

  async update(user: UserFormDto, outerId: string) {
    const userEntity = await this.findOneByOuterId(outerId);
    userEntity.setUsername(user.username);
    await this.save(userEntity);
  }

  async profile(outerId: string) {
    const profile = await this.findOneByOuterId(outerId);
    return {
      id: profile.id,
      username: profile.username,
      catCount: (await profile.cats_photo).length,
    };
  }
}

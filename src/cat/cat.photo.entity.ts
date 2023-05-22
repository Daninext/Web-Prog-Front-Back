import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserClass } from '../user/user.entity';
import { BreedClass } from './breed/breed.entity';

@Entity()
export class CatClass {
  @PrimaryGeneratedColumn()
  @ApiProperty({ type: Number })
  id: number;

  @Column()
  @ApiProperty({ type: String })
  data: string;

  @Column()
  @ApiProperty({ type: String })
  name: string;

  @ManyToOne((type) => BreedClass, { eager: true })
  @ApiProperty({ type: BreedClass })
  breed: BreedClass;

  @ManyToOne((type) => UserClass, (user) => user.cats_photo)
  @ApiProperty({ type: UserClass })
  owner: Promise<UserClass>;

  constructor(data: string, name: string, breed: BreedClass) {
    this.data = data;
    this.name = name;
    this.breed = breed;
  }

  setUser(user: UserClass) {
    this.owner = Promise.resolve(user);
  }
}

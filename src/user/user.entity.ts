import { Role } from './dto/role.enum';
import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CatClass } from '../cat/cat.photo.entity';
import { GroupClass } from './group/group.entity';

@Entity()
export class UserClass {
  @PrimaryGeneratedColumn()
  @ApiProperty({ type: Number })
  id: number;

  @Column()
  @ApiProperty({ type: String })
  username: string;

  @Column()
  @ApiProperty({ type: String })
  outerId: string;

  //@Column({ default: Role.User })
  //@ApiProperty({ enum: ['guest', 'user', 'admin'] })
  //role: Role;

  @Column({ default: true })
  @ApiProperty({ type: Boolean })
  isActive: boolean;

  @OneToMany((type) => CatClass, (cat) => cat.owner, { onDelete: 'CASCADE' })
  @ApiProperty({ type: [CatClass] })
  cats_photo: Promise<CatClass[]>;

  constructor(outerId: string, username: string) {
    this.username = username;
    this.outerId = outerId;
  }

  setUsername(username: string) {
    this.username = username;
  }
}

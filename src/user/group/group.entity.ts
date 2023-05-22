import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ChatElement } from './chat/chatElement';

@Entity()
export class GroupClass {
  @PrimaryGeneratedColumn()
  @ApiProperty({ type: Number })
  id: number;

  @Column()
  @ApiProperty({ type: String })
  code: string;

  @OneToMany((type) => ChatElement, (element) => element.chat)
  @ApiProperty({ type: [ChatElement] })
  history: Promise<ChatElement[]>;

  constructor(code: string) {
    this.code = code;
  }
}

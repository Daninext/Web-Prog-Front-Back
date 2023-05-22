import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class BreedClass {
  @PrimaryGeneratedColumn()
  @ApiProperty({ type: Number })
  id: number;

  @Column()
  @ApiProperty({ type: String })
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

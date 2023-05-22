import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class EndpointEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ type: Number })
  id: number;

  @Column()
  @ApiProperty({ type: String })
  path: string;

  @Column({ default: 0 })
  @ApiProperty({ type: Number })
  count: number;

  constructor(path: string) {
    this.path = path;
    this.count = 0;
  }

  increaseCount() {
    this.count++;
  }
}

import { ApiProperty } from '@nestjs/swagger';

export class UserAnswerDto {
  @ApiProperty({ type: String })
  username: string;
  @ApiProperty({ type: String })
  token: string;

  constructor(username: string, token: string) {
    this.username = username;
    this.token = token;
  }
}

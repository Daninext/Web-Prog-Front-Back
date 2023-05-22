import { Module, Global } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';

@Global()
@Module({
  controllers: [],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
export class ChatModule {}

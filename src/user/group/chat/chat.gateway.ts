import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private chatService: ChatService) {}
  @WebSocketServer() public server: Server;
  //private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {
    this.chatService.socket = server;
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, data: string) {
    client.rooms.forEach((room) => {
      if (room !== client.id) client.leave(room);
    });

    client.join(data);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, data) {
    this.server.in(data.code).emit('message-client', { message: data.message });
  }
}

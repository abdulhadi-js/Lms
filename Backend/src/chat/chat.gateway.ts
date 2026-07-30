import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';

@WebSocketGateway({ cors: true, namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token?.replace('Bearer ', '');
    if (token) {
      try {
        const payload = this.jwtService.verify(token);
        client.data.userId = payload.sub;
      } catch (err) {
        client.disconnect();
      }
    } else {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // Cleanup
  }

  @SubscribeMessage('join')
  handleJoin(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
    client.join(room);
    return { event: 'joined', room };
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: SendMessageDto,
  ) {
    const userId = client.data.userId;
    const msg = await this.chatService.sendMessage(userId, dto);

    if (dto.sectionId) {
      this.server.to(dto.sectionId).emit('new_message', msg);
    } else if (dto.receiverId) {
      this.server.to(dto.receiverId).emit('new_message', msg);
      // Emit to sender as well
      client.emit('new_message', msg);
    }

    return msg;
  }
}

import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    // Client connected
  }

  handleDisconnect(client: Socket) {
    // Client disconnected
  }

  @SubscribeMessage('identify')
  handleIdentify(
    @MessageBody() data: { role: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (data.role) {
      client.join(`role_${data.role}`);
    }
    if (data.userId) {
      client.join(`user_${data.userId}`);
    }
    return { event: 'identified', data: true };
  }

  emitNewNotification(notification: any) {
    if (notification.audienceRole) {
      this.server
        .to(`role_${notification.audienceRole}`)
        .emit('new-notification', notification);
    } else {
      this.server.emit('new-notification', notification);
    }
  }
}

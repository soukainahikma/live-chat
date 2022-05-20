import { Logger } from '@nestjs/common';
import { Socket ,Server} from 'socket.io';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';

@WebSocketGateway( {cors: {
  origin: '*',

},
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server
  private logger: Logger = new Logger('AppGateway');
  afterInit(server: Server) {
    this.logger.log('init')
  }
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log('connection')
    console.log("entered");
    
  }
  handleDisconnect(client: Socket) {
    this.logger.log('disconnection')
  } 
  @SubscribeMessage('send_message')
  handle_send(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ):void{

    client.to(data.room).emit('receive_message',data)
  }
  @SubscribeMessage('join_room')
  handleRoom(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
    ): void {
    client.join(data);
  }
  
}

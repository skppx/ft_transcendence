import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PongSocket } from './pong.interface';
import { PongService } from './pong.service';
import { ClassicParty } from './party/classic-party/classic-party';

@WebSocketGateway()
export class PongGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(PongGateway.name);

  private socketMap = new Map<string, PongSocket>();

  @WebSocketServer() io: Server;

  constructor(private pongService: PongService) {}

  afterInit() {
    this.logger.log('Initialize');
  }

  handleConnection(client: PongSocket): any {
    this.pongService.handleConnection(client);
    this.socketMap.set(client.user.id!, client);
    this.socketMap.set(client.user.username!, client);
    this.logger.debug(`New connection : ${client.user.id}`);
  }

  handleDisconnect(client: PongSocket): any {
    this.pongService.handlePlayerReady(client, false);
    this.pongService.handleLeaveWaitingRoom(client);
    this.pongService.handleDestroyInvite(client);
    this.pongService.handleDenySpeedInvite(client);
    this.pongService.handleDenyClassicInvite(client);
    this.socketMap.delete(client.user.id!);
    this.socketMap.delete(client.user.username!);
    this.logger.debug(`Disconnected : ${client.user.id}`);
  }

  @SubscribeMessage('leaveParty')
  handleLeaveParty(client: PongSocket) {
    this.pongService.handleLeaveParty(client);
  }

  @SubscribeMessage('leaveWaitingRoom')
  handleLeaveWaitingRoom(client: PongSocket) {
    this.pongService.handlePlayerReady(client, false);
    this.pongService.handleLeaveWaitingRoom(client);
  }

  @SubscribeMessage('joinClassicWaitingRoom')
  handleJoinWaitingRoom(client: PongSocket) {
    this.pongService.handleJoinClassicWaitingRoom(client, this.io);
  }

  @SubscribeMessage('joinSpeedWaitingRoom')
  handleSpeedJoinWaitingRoom(client: PongSocket) {
    this.pongService.handleJoinSpeedWaitingRoom(client, this.io);
  }

  @SubscribeMessage('playerRole')
  handleRole(client: PongSocket) {
    this.pongService.handleRole(client);
  }

  @SubscribeMessage('playAgain')
  handlePlayAgain(client: PongSocket) {
    client.emit('playAgain');
  }

  @SubscribeMessage('createClassicInvite')
  async handleCreateClassicInvite(client: PongSocket, invitedId: string) {
    const idClient = client.user.id!;
    const player2 = this.socketMap.get(invitedId);
    if (idClient !== invitedId && player2) {
      this.pongService.handleCreateClassicInvite(client, player2);
    }
  }

  @SubscribeMessage('destroyInvite')
  async handleDestroyInvite(client: PongSocket) {
    this.pongService.handleDestroyInvite(client);
  }

  @SubscribeMessage('createSpeedInvite')
  async handleCreateSpeedInvite(client: PongSocket, invitedId: string) {
    const idClient = client.user.id!;
    const player2 = this.socketMap.get(invitedId);
    if (idClient !== invitedId && player2) {
      this.pongService.handleCreateSpeedInvite(client, player2);
    }
  }

  @SubscribeMessage('acceptClassicInvite')
  async handleAcceptClassicInvite(client: PongSocket) {
    this.pongService.handleAcceptClassicInvite(client, this.io);
  }

  @SubscribeMessage('acceptSpeedInvite')
  async handleAcceptSpeedInvite(client: PongSocket) {
    this.pongService.handleAcceptSpeedInvite(client, this.io);
  }

  @SubscribeMessage('denyClassicInvite')
  async handleDenyClassicInvite(client: PongSocket) {
    this.pongService.handleDenyClassicInvite(client);
  }

  @SubscribeMessage('denySpeedInvite')
  async handleDenySpeedInvite(client: PongSocket) {
    this.pongService.handleDenySpeedInvite(client);
  }

  @SubscribeMessage('initialState')
  handleInitialState(client: PongSocket) {
    client.emit('gameState', ClassicParty.getInitGameState());
  }

  @SubscribeMessage('playerReady')
  handlePlayerReady(client: PongSocket) {
    this.pongService.handlePlayerReady(client, true);
  }

  @SubscribeMessage('playerNotReady')
  handlePlayerNotReady(client: PongSocket) {
    this.pongService.handlePlayerReady(client, false);
  }

  @SubscribeMessage('isPlayerReady')
  handleIsPlayerReady(client: PongSocket) {
    this.pongService.handleIsPlayerReady(client);
  }

  @SubscribeMessage('arrowUp')
  handleArrowUp(client: PongSocket, isPressed: boolean): void {
    this.pongService.handleArrowUp(client, isPressed);
  }

  @SubscribeMessage('arrowDown')
  handleArrowDown(client: PongSocket, isPressed: boolean): void {
    this.pongService.handleArrowDown(client, isPressed);
  }
}

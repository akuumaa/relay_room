import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import {ChatGateway} from "./chat.gateway";
import {RoomModule} from "../room/room.module";

@Module({
  imports: [RoomModule],
  providers: [ChatGateway, ChatService],
  controllers: [ChatController]
})
export class ChatModule {}

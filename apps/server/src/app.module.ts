import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomModule } from './modules/room/room.module';
import { ChatModule } from './modules/chat/chat.module';
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [
      ConfigModule.forRoot({isGlobal: true}),
      RoomModule,
      ChatModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

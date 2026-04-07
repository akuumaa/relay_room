import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayDisconnect,
    WsException,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { RoomService } from "../room/room.service";
import { UsePipes, ValidationPipe } from "@nestjs/common";
import { JoinRoomDto } from "./dto/join-room.dto";
import { SendMessageDto } from "./dto/send-message.dto";

@WebSocketGateway({
    cors: {
        origin: true,
        credentials: true,
    },
})
export class ChatGateway implements OnGatewayDisconnect {
    @WebSocketServer()
    server!: Server;

    constructor(private readonly roomService: RoomService) {}

    @UsePipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }),
    )
    @SubscribeMessage("room:join")
    handleJoinRoom(
        @MessageBody() payload: JoinRoomDto,
        @ConnectedSocket() client: Socket,
    ){
        try{
            const room = this.roomService.getRoomById(payload.roomId);

            client.join(room.id);
            this.roomService.addParticipant(room.id, client.id);

            this.server.to(room.id).emit("room:user-joined", {
                socketId: client.id,
                participantsCount: room.participants.size,
            });
            return {
                event: "room:joined",
                data: {
                    roomId: room.id,
                    code: room.code,
                    participantsCount: room.participants.size,
                },
            };
        } catch(error) {
            throw new WsException(
                error instanceof Error ? error.message : "Failed to connect to the Room",
            );
        }
    }
    @UsePipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }),
    )
    @SubscribeMessage("message:send")
    handleSendMessage(
        @MessageBody() payload: SendMessageDto,
        @ConnectedSocket() client: Socket,
    ){
        try{
            const room = this.roomService.getRoomById(payload.roomId);

            this.server.to(room.id).emit("message:received", {
                roomId: room.id,
                senderId: client.id,
                message: payload.message,
                sendAt: new Date().toISOString(),
            });

            return {ok : true };
        } catch(error) {
            throw new WsException(
                error instanceof Error ? error.message : "Failed to send message",
            );
        }
    }

    async handleDisconnect(client: Socket) {
        const rooms = client.rooms;

        for (const roomId of rooms) {
            if (roomId === client.id) continue;
            this.roomService.removeParticipant(roomId, client.id);
            this.server.to(roomId).emit("room:user-left", {
                socketId: client.id,
            })
        }
    }
}
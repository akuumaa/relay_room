import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { OnGatewayDisconnect} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { RoomService } from "../room/room.service";

interface JoinRoomPayload {
    roomId: string;
}

interface SendMessagePayload {
    roomId: string;
    message: string;
}

@WebSocketGateway({
    cors: {
        origin: true,
        credentials: true,
    },
})
export class ChatGateway implements OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(private readonly roomService: RoomService) {}

    @SubscribeMessage("room:join")
    handleJoinRoom(
        @MessageBody() payload: JoinRoomPayload,
        @ConnectedSocket() client: Socket,
    ){
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
    }

    @SubscribeMessage("message:send")
    handleSendMessage(
        @MessageBody() payload: SendMessagePayload,
        @ConnectedSocket() client: Socket,
    ){
        const room = this.roomService.getRoomById(payload.roomId);

        this.server.to(room.id).emit("message:received", {
            roomId: room.id,
            senderId: client.id,
            message: payload.message,
            sendAt: new Date().toISOString(),
        });

        return {ok : true };
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
import { OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { RoomService } from "../room/room.service";
import { JoinRoomDto } from "./dto/join-room.dto";
import { SendMessageDto } from "./dto/send-message.dto";
export declare class ChatGateway implements OnGatewayDisconnect {
    private readonly roomService;
    server: Server;
    constructor(roomService: RoomService);
    handleJoinRoom(payload: JoinRoomDto, client: Socket): {
        event: string;
        data: {
            roomId: string;
            code: string;
            participantsCount: number;
        };
    };
    handleSendMessage(payload: SendMessageDto, client: Socket): {
        ok: boolean;
    };
    handleDisconnect(client: Socket): Promise<void>;
}

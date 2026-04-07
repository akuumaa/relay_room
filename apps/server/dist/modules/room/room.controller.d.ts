import { RoomService } from "./room.service";
export declare class RoomController {
    private readonly roomService;
    constructor(roomService: RoomService);
    createRoom(): {
        id: string;
        code: string;
        createdAt: Date;
    };
    getRoomByCode(code: string): {
        id: string;
        code: string;
        createdAt: Date;
        participants: number;
    };
}

export interface Room {
    id: string;
    code: string;
    createdAt: Date;
    participants: Set<string>;
}
export declare class RoomService {
    private readonly rooms;
    createRoom(): Room;
    getRoomById(roomId: string): Room;
    getRoomByCode(code: string): Room;
    addParticipant(roomId: string, socketId: string): Room;
    removeParticipant(roomId: string, socketId: string): void;
    private generateUniqueRoomCode;
    private generateRoomCode;
}

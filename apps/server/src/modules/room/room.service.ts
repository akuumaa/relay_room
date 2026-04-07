import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from "node:crypto";

export interface Room {
    id: string;
    code: string;
    createdAt: Date;
    participants: Set<string>;
}

@Injectable()
export class RoomService {
    private readonly rooms = new Map<string, Room>();

    createRoom(): Room {
        const room: Room = {
            id: randomUUID(),
            code: this.generateUniqueRoomCode(),
            createdAt: new Date(),
            participants: new Set<string>(),
        }
        this.rooms.set(room.id, room);
        return room;
    }
    getRoomById(roomId: string): Room {
        const room = this.rooms.get(roomId);
        if (!room) {
            throw new NotFoundException(`Room with id ${roomId} not found`);
        }
        return room;
    }

    getRoomByCode(code: string): Room {
        const room = [...this.rooms.values()].find((entry)=> entry.code === code);
        if (!room) {
            throw new NotFoundException('Room not found')
        }
        return room;
    }

    addParticipant(roomId: string, socketId: string): Room {
        const room = this.getRoomById(roomId);
        room.participants.add(socketId);
        return room;
    }

    removeParticipant(roomId: string, socketId: string) {
        const room = this.rooms.get(roomId);
        if(!room) return;
        room.participants.delete(socketId);
        if(room.participants.size === 0) {
            this.rooms.delete(roomId);
        }
    }

    private generateUniqueRoomCode(length = 6): string {
        let code = this.generateRoomCode(length);

        while (Array.from(this.rooms.values()).some((room) => room.code === code)) {
            code = this.generateRoomCode(length);
        }
        return code;
    }

    private generateRoomCode(length= 6): string {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = '';

        for (let i = 0; i < length; i++) {
            result+=chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }
}

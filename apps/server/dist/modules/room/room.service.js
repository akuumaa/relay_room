"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
let RoomService = class RoomService {
    rooms = new Map();
    createRoom() {
        const room = {
            id: (0, node_crypto_1.randomUUID)(),
            code: this.generateUniqueRoomCode(),
            createdAt: new Date(),
            participants: new Set(),
        };
        this.rooms.set(room.id, room);
        return room;
    }
    getRoomById(roomId) {
        const room = this.rooms.get(roomId);
        if (!room) {
            throw new common_1.NotFoundException(`Room with id ${roomId} not found`);
        }
        return room;
    }
    getRoomByCode(code) {
        const room = [...this.rooms.values()].find((entry) => entry.code === code);
        if (!room) {
            throw new common_1.NotFoundException('Room not found');
        }
        return room;
    }
    addParticipant(roomId, socketId) {
        const room = this.getRoomById(roomId);
        room.participants.add(socketId);
        return room;
    }
    removeParticipant(roomId, socketId) {
        const room = this.rooms.get(roomId);
        if (!room)
            return;
        room.participants.delete(socketId);
        if (room.participants.size === 0) {
            this.rooms.delete(roomId);
        }
    }
    generateUniqueRoomCode(length = 6) {
        let code = this.generateRoomCode(length);
        while (Array.from(this.rooms.values()).some((room) => room.code === code)) {
            code = this.generateRoomCode(length);
        }
        return code;
    }
    generateRoomCode(length = 6) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }
};
exports.RoomService = RoomService;
exports.RoomService = RoomService = __decorate([
    (0, common_1.Injectable)()
], RoomService);
//# sourceMappingURL=room.service.js.map
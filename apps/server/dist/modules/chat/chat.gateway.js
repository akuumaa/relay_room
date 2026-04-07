"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const room_service_1 = require("../room/room.service");
const common_1 = require("@nestjs/common");
const join_room_dto_1 = require("./dto/join-room.dto");
const send_message_dto_1 = require("./dto/send-message.dto");
let ChatGateway = class ChatGateway {
    roomService;
    server;
    constructor(roomService) {
        this.roomService = roomService;
    }
    handleJoinRoom(payload, client) {
        try {
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
        catch (error) {
            throw new websockets_1.WsException(error instanceof Error ? error.message : "Failed to connect to the Room");
        }
    }
    handleSendMessage(payload, client) {
        try {
            const room = this.roomService.getRoomById(payload.roomId);
            this.server.to(room.id).emit("message:received", {
                roomId: room.id,
                senderId: client.id,
                message: payload.message,
                sendAt: new Date().toISOString(),
            });
            return { ok: true };
        }
        catch (error) {
            throw new websockets_1.WsException(error instanceof Error ? error.message : "Failed to send message");
        }
    }
    async handleDisconnect(client) {
        const rooms = client.rooms;
        for (const roomId of rooms) {
            if (roomId === client.id)
                continue;
            this.roomService.removeParticipant(roomId, client.id);
            this.server.to(roomId).emit("room:user-left", {
                socketId: client.id,
            });
        }
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    })),
    (0, websockets_1.SubscribeMessage)("room:join"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [join_room_dto_1.JoinRoomDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    })),
    (0, websockets_1.SubscribeMessage)("message:send"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_message_dto_1.SendMessageDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleSendMessage", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: true,
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [room_service_1.RoomService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map
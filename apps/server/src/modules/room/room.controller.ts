import {Controller, Get, Param, Post} from '@nestjs/common';
import {RoomService} from "./room.service";

@Controller('rooms')
export class RoomController {
    constructor(private readonly roomService: RoomService) {}

    @Post()
    createRoom(){
        const room = this.roomService.createRoom();

        return {
            id: room.id,
            code: room.code,
            createdAt: room.createdAt,
        };
    }

    @Get(':code')
    getRoomByCode(@Param('code') code: string) {
        const room = this.roomService.getRoomByCode(code);
        return {
            id: room.id,
            code: room.code,
            createdAt: room.createdAt,
            participants: room.participants.size,
        };
    }
}

import { IsString, IsUUID } from 'class-validator';

export class JoinRoomDto {
    @IsString()
    @IsUUID()
    roomId!: string;
}
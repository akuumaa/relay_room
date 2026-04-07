import { IsString, Length, Matches } from "class-validator";

export class GetRoomByCodeParamsDto {
    @IsString()
    @Length(6,6)
    @Matches(/^[A-Z0-9]+$/)
    code!: string;
}
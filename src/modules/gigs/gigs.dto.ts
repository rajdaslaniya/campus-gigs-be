import { IsString } from "class-validator";

export class PostGigsDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    tire: string;
};
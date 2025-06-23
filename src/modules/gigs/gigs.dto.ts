import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

export class PostGigsDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    tire: string;

    @IsNumber()
    price: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    keywords: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    certifications: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    skills: string[];
};
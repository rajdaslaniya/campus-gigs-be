import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { SkillDto } from './skills.dto';

@Injectable()
export class SkillsService {
    constructor(private prisma: PrismaService) { }

    async createSkill(dto: SkillDto) {
        // Check if name already exists (and not deleted)
        const exists = await this.prisma.skills.findFirst({
            where: {
                name: dto.name,
                is_deleted: false,
            },
        });

        if (exists) {
            throw new BadRequestException(`Skill with name '${dto.name}' already exists.`);
        }

        return this.prisma.skills.create({
            data: {
                name: dto.name,
            },
        });
    }

    async getAllSkills() {
        return this.prisma.skills.findMany({
            where: { is_deleted: false },
        });
    }

    async getSkillById(id: number) {
        return this.prisma.skills.findUnique({
            where: { id },
        });
    }

    async updateSkill(id: number, dto: SkillDto) {
        return this.prisma.skills.update({
            where: { id },
            data: {
                name: dto.name,
            },
        });
    }

    async deleteSkill(id: number) {
        return this.prisma.skills.update({
            where: { id },
            data: {
                is_deleted: true,
            },
        });
    }
}



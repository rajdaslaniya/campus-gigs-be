import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateTermsDto, UpdateTermsDto } from './terms.dto';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TermsService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async create(createDto: CreateTermsDto) {
    return this.prisma.terms.create({ data: createDto });
  }

  async findAll() {
    return this.prisma.terms.findMany();
  }

  async findOne(id: number) {
    const term = await this.prisma.terms.findUnique({ where: { id } });
    if (!term) throw new NotFoundException('Term not found');
    return term;
  }

  async update(id: number, updateDto: UpdateTermsDto) {
    const updated = await this.prisma.terms.update({
      where: { id },
      data: updateDto,
    });

    await this.userService.updatePolicyForAllUser();

    if (!updated) throw new NotFoundException('Term not found');
    return updated;
  }

  async remove(id: number) {
    const result = await this.prisma.terms.delete({ where: { id } });
    if (!result) throw new NotFoundException('Term not found');
    return { message: 'Deleted successfully' };
  }
}

import { Injectable } from '@nestjs/common';
import { CreateBidDto } from './bids.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BidsService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  createBid(createBidDto: CreateBidDto) {
    return this.prismaService.bid.create({
      data: createBidDto,
    });
  } 

  getBidsByGigId(gigId: number) {
    return this.prismaService.bid.findMany({
      where: {
        gig_id: gigId,
      }
    });
  }
}
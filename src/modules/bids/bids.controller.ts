import { Controller, Post, Body, Param, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { BidsService } from './bids.service';
import { CreateBidDto } from './bids.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';

@Controller('bids')
@UseGuards(JwtAuthGuard)
export class BidsController {
  constructor(private readonly bidsService: BidsService) { }

  @Post('create')
  async createBid(@Body() createBidDto: CreateBidDto, @Req() request: Request) {
    const user = request.user as any;
    const newBody = {
      ...createBidDto,
      provider_id: Number(user?.id)
    };
    return this.bidsService.createBid(newBody);
  }

  @Get('gig/:gigId')
  async getBidsByGigId(@Param('gigId') gigId: number) {
    return this.bidsService.getBidsByGigId(gigId);
  }
}
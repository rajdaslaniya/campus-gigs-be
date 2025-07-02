import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { BidsService } from './bids.service';
import { CreateBidDto } from './bids.dto';

@Controller('bids')
export class BidsController {
  constructor(private readonly bidsService: BidsService) { }

  @Post('create')
  async createBid(@Body() createBidDto: CreateBidDto) {
    return this.bidsService.createBid(createBidDto);
  }

  @Get(':gigId')
  async getBidsByGigId(@Param('gigId') gigId: number) {
    return this.bidsService.getBidsByGigId(gigId);
  }
}
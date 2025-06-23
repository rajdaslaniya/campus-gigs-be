import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Gigs, GIGS_MODEL } from './gigs.schema';
import { Model } from 'mongoose';
import { PostGigsDto } from './gigs.dto';

@Injectable()
export class GigsService {
  constructor(@InjectModel(GIGS_MODEL) private gigsModel: Model<Gigs>) {}

  create(body: PostGigsDto) {
    console.log(body)
  }
}

import { Injectable } from '@nestjs/common';
import { CreateBidDto } from './bids.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BidsService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  createBid(body: CreateBidDto) {
    return this.prismaService.bid.create({
      data: {
        ...body,
        gig_id: Number(body.gig_id),
      },
    });
  }

  async getBidsByGigId(gigId: number) {
    const bids = await this.prismaService.bid.findMany({
      where: {
        gig_id: gigId,
        is_deleted: false,
      },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            profile: true,
            professional_interests: true,
            gigs_provider: {
              where: {
                is_deleted: false,
                rating: {
                  isNot: null
                }
              },
              select: {
                rating: {
                  select: {
                    rating: true
                  }
                }
              }
            }
          }
        }
      }
    });

    const transformedBids = bids.map(bid => {
      const ratings = bid.provider.gigs_provider
        .filter(gig => gig.rating)
        .map(gig => gig.rating?.rating ?? 0);

      const totalReview = ratings.length;
      const avgRating = totalReview > 0
        ? ratings.reduce((sum, rating) => sum + rating, 0) / totalReview
        : 0;

      return {
        id: bid.id,
        provider: {
          id: bid.provider.id,
          name: bid.provider.name,
          profile: bid.provider.profile,
          avgRating: parseFloat(avgRating.toFixed(1)),
          totalReview,
          about: bid.provider.professional_interests
        },
        status: bid.status,
        description: bid.description,
        payment_type: bid.payment_type,
        bid_amount: bid.bid_amount,
        created_at: bid.created_at,
        updated_at: bid.updated_at
      };
    });

    return transformedBids;
  }
}
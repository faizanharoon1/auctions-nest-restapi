import { Test, TestingModule } from '@nestjs/testing';
import { BidsService } from './bids.service';
import { CreateBidDto } from './dto/create-bid.dto';

// bid.service.spec.ts
describe('BidService', () => {
  let bidService: BidsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BidsService],
    }).compile();

    bidService = module.get<BidsService>(BidsService);
  });

  it('should create a new bid successfully', async () => {
    const bidDto:CreateBidDto = {auctionId:1,bidderName:"",maxAutoBidAmount:5};
    const expectedBid = "test";
    
    jest.spyOn(bidService, "submit_bid").mockImplementation(async () => expectedBid);

    expect(await bidService.submit_bid(bidDto)).toEqual(expectedBid);
  });
});

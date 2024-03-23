import { BadRequestException, Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auction } from 'src/auctions/entities/auction.entity';
import { CreateBidDto } from './dto/create-bid.dto';
import { EventEmitter2 } from '@nestjs/event-emitter'; // for broadcasting events
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
// import { dynamoDB } from 'src/database/dynamo-db-service';
import { Bid } from './entities/bid.entity';
import { v4 as uuidv4 } from 'uuid';
import { DynamoDBService } from 'src/database/dynamo.db.service';
import { MyLogger } from 'src/logmodule/logmodule.service';

@Injectable()
export class BidsService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(Auction) private readonly auctionRepo: Repository<Auction>,
    private eventEmitter: EventEmitter2, // Event emitter for SSE
      private dynamoDBService: DynamoDBService
  ) {}

  private tableName = 'Bids';
 private readonly logger = new MyLogger();
  async submit_bid(createBidDto: CreateBidDto): Promise<string> {
    let auction = await this.GetAuction(createBidDto);

        // Check if the reserve price is met and return an appropriate message
    if (createBidDto.maxAutoBidAmount < auction.reservePrice) {
       throw new BadRequestException(`The reserve price has not been met for ${auction.auctionName}`);
    } 

       if (createBidDto.bidderName === auction.createdBy) {
       throw new BadRequestException(`You are the owner of this auction: ${auction.auctionName}`);
    } 
 
    // Find the highest current bid for the auction
    const currentHighestBid = await this.GetHighestBidFromRedis(createBidDto.auctionId);
    //console.log(currentHighestBid.auctionId)
    let bidAmount = 0;
    let sameBidder=false;

if (!currentHighestBid) {
  // This is the first bid for the auction
  bidAmount = createBidDto.maxAutoBidAmount;
} else {
  // Check if the new bid comes from the same bidder as the highest current bid
  sameBidder = currentHighestBid.bidderName === createBidDto.bidderName;

  if (Number(currentHighestBid.maxAutoBidAmount) + 1 < createBidDto.maxAutoBidAmount) {
    // If the new bid is higher, update bidAmount +1
    bidAmount = sameBidder ? createBidDto.maxAutoBidAmount : Number(currentHighestBid.maxAutoBidAmount) + 1;
  }
}

    const now = new Date();
const params = {
      TableName: this.tableName,
      Item: new Bid({
        auctionId:auction.id,
        bidderName:createBidDto.bidderName,
        maxAutoBidAmount:createBidDto.maxAutoBidAmount,
        created:now.toISOString(),
        id: uuidv4()
      })
    };

    try {
      await this.dynamoDBService.putItem(params);
     
    } catch (error) {
      console.error("Error creating bid: ", error);
      throw new Error("Error creating bid");
    }

  this.logger.log(`Bid received:Bidder:${createBidDto.bidderName}`)
    if(!sameBidder && bidAmount > 0)
    {
      
    auction.bidderName=createBidDto.bidderName;
    auction.currentBid=bidAmount;

      await this.auctionRepo.save(auction)
      this.cacheManager.del(`highestbid_${auction.id}`)
      this.cacheManager.del(`auction_${auction.id}`)

        // **We should use Redis PubSub for broadcasting for multi instance apps
        // Emit an event for bids exceeding the reserve price,
        // informing previous highest bidders they've been outbid.
        console.log(currentHighestBid?.bidderName)
        this.publishToRedisChannel(currentHighestBid?.bidderName, `${currentHighestBid?.bidderName}
        : You have been outbid for auction:${auction.auctionName}!`);
    }



 return "Bid request processed!";
  }

  private async createlog(message:string)
  {

  }
  private async GetAuction(createBidDto: CreateBidDto) {
    const cacheKey = `auction_${createBidDto.auctionId}`;
    let auction = await this.cacheManager.get<Auction>(cacheKey);
    if (!auction) {
      // If not in cache, fetch from the database
      auction = await this.auctionRepo.findOneBy({ id: createBidDto.auctionId });
      if (!auction) {
        throw new BadRequestException('Auction item not found.');
      }
      // Store the fetched auction in cache for next time
      await this.cacheManager.set(cacheKey, auction);
    }
    return auction;
  }

   private async GetHighestBidFromRedis(auctionId:number) {

    // we should use dedicated REDIS cache here, I am just using cache manager for simplicity/cost
    // ----------------------------------------------------------------------------------------------
    const cacheKey = `highestbid_${auctionId}`;
  
    let bid = await this.cacheManager.get<Bid>(cacheKey);
    if (!bid) {
     bid = await this.findHighestBid(auctionId);
    
      if (!bid) {
      return null;
      }
      // Store the fetched bid in cache for next time
  
      await this.cacheManager.set(cacheKey, bid);
    }
    return bid;
  }

   private async findHighestBid(auctionId: number): Promise<Bid> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: 'auctionId = :auctionId',
      ExpressionAttributeValues: {
        ':auctionId': auctionId,
      },
      ScanIndexForward: false, // This will sort the results in descending order based on SK
      Limit: 1, // We only want the top result
    };

    try {
      const result = await this.dynamoDBService.queryItems(params);
      if (result.length) {
        // Convert the DynamoDB item to a Bid entity
        const bidItem = result[0];
        const bid = new Bid({
             auctionId: bidItem.auctionId,
            maxAutoBidAmount: bidItem.maxAutoBidAmount,
            bidderName: bidItem.bidderName,
            // Map other attributes as necessary
        });
        return bid;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error finding highest bid: ", error);
      throw new Error("Error finding highest bid");
    }
  }

  //imagine this is redis pub/sub
   private publishToRedisChannel(user_Id: string, message: string) {
    // Emit the 'message.sent' event with the message as payload
    if(!user_Id || !message)
    return;
   console.log("userid:"+user_Id)
     console.log("message:"+message)
    this.eventEmitter.emit('message.outbid', {user_Id, message});
   
  }

  
}


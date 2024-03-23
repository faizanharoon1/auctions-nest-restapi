import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuctionItem } from 'src/auctions/auctionitems/entities/auction.item.entity';
import { DatabaseService } from 'src/database/mysql.db.service';
import { DeepPartial, Repository } from 'typeorm';


@Injectable()
export class AuctionitemsService extends DatabaseService<AuctionItem> {
  constructor(
    @InjectRepository(AuctionItem) private readonly _repo: Repository<AuctionItem>,
  ) {
    // Pass the repository to the superclass constructor
    super(_repo);
  }
  async createItem(entity: DeepPartial<AuctionItem> ): Promise<AuctionItem> {
    const item:AuctionItem = await super.create(entity);
    return item
  }
}
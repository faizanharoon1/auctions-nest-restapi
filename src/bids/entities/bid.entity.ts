export class Bid {
    id: string; // Unique identifier for the bid
    auctionId: number; // Identifier of the auction item this bid is for
    maxAutoBidAmount: number; // Maximum automatic bid amount
    bidderName: string; // Identifier of the bidder
    created: string; // Timestamp of when the bid was created

    constructor(init?: Partial<Bid>) {
        Object.assign(this, init);
    }
}



// import { Auction } from "src/auctions/entities/auction.entity";
// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

// @Entity({name:"bids"})
// export class Bid {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column('decimal', { precision: 10, scale: 2, nullable: true })
//   maxAutoBidAmount: number; // The maximum amount the bidder is willing to pay

//   @Column()
//   bidderName: string;

//   // Maintain referential integrity without fetching bids from AuctionItem
//   @ManyToOne(() => Auction)
//   @JoinColumn({ name: 'auctionId' }) // Ensures the foreign key in the database
//   auctionItem: Auction;

//   @Column({
//     type: 'datetime',
//     precision: 6, // for microseconds precision
//     default: () => 'CURRENT_TIMESTAMP(6)',
//   })
//   created: Date;
// }

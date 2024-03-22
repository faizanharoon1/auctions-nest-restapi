# Auctions-NestJS-RestAPI

Auctions-NestJS-RestAPI is a backend service designed to facilitate online auctions, serving as a Proof of Concept (POC) for integrating various technologies like MySQL, DynamoDB, Nest Cachemanager (Redis for Prod), TypeORM, and Class Validators within a NestJS application. This project demonstrates how to architect a scalable and efficient auction system.

## Features

- **User Management**: TODO
- **Auction Management**: Create and list auctions with items (MySql)
- **Real-time Bidding**: Utilize DynamoDB to handle real-time bids, ensuring fast and reliable bidding transactions.
- **Data Validation**: Employ Class Validators to enforce data integrity
- **Caching**: Best we use Redis-based caching for multi instance, this uses CacheManager
- **RESTful API**: Expose endpoints for interacting with the auction system

## Technologies

- **[NestJS](https://nestjs.com/)**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **[TypeORM](https://typeorm.io/)**: An ORM that can run in Node.js and be used with TypeScript and JavaScript (ES5, ES6, ES7, ES8).
- **[MySQL](https://www.mysql.com/)**: The world's most popular open source database.
- **[DynamoDB](https://aws.amazon.com/dynamodb/)**: A key-value and document database that delivers single-digit millisecond performance at any scale.

### Prerequisites

What things you need to install the software and how to install them:

- Node.js
- NestJS CLI
- MySQL
- AWS Account (for DynamoDB & MySql)
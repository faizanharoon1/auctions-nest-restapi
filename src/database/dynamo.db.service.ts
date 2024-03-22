import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class DynamoDBService {
  private dynamoDBClient: AWS.DynamoDB.DocumentClient;

  constructor(private configService: ConfigService) {
    const accessKeyId = this.configService.get<string>('DATABASE_DYNAMODB_KEYID');
    const secretAccessKey = this.configService.get<string>('DATABASE_DYNAMODB_SECRET');

    AWS.config.update({
      region: "us-east-2",
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    });

    this.dynamoDBClient = new AWS.DynamoDB.DocumentClient();
  }

  async queryItems(params: AWS.DynamoDB.DocumentClient.QueryInput): Promise<AWS.DynamoDB.DocumentClient.ItemList> {
    try {
        const data = await this.dynamoDBClient.query(params).promise();
        return data.Items || [];
    } catch (error) {
        throw new Error(`Error querying items from DynamoDB: ${error}`);
    }
}


  async putItem(params: AWS.DynamoDB.DocumentClient.PutItemInput): Promise<void> {
    try {
        await this.dynamoDBClient.put(params).promise();
    } catch (error) {
        throw new Error(`Error putting item to DynamoDB: ${error}`);
    }
}


  // Add more methods to interact with DynamoDB as needed
}

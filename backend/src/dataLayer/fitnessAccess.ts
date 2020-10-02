import * as AWS from "aws-sdk";
// import * as AWSXRay from "aws-xray-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { FitnessItem } from "../models/FitnessItem";
import { createLogger } from "../utils/logger";

const logger = createLogger("auth");

// const XAWS = AWSXRay.captureAWS(AWS);

export class FitnessAccess {
  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly fitnessTable = process.env.FITNESS_TABLE,
    private readonly avaibleIndex = process.env.AVAILABLE_INDEX,
    private readonly bucketName = process.env.FITNESS_IMAGES_S3_BUCKET
  ) {}

  async getAvailableFitness(): Promise<FitnessItem[]> {
    const result = await this.docClient
      .query({
        TableName: this.fitnessTable,
        IndexName: this.avaibleIndex,
        KeyConditionExpression: "available = :available",
        ExpressionAttributeValues: {
          ":available": "true",
        },
      })
      .promise();

    logger.info(`Found ${result.Count} available Fitness`);

    const items = result.Items;

    return items as FitnessItem[];
  }

  async getUserFitness(userId: string): Promise<FitnessItem[]> {
    const result = await this.docClient
      .query({
        TableName: this.fitnessTable,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      })
      .promise();

    logger.info(`Found ${result.Count} available Fitness for user ${userId}`);

    const items = result.Items;

    return items as FitnessItem[];
  }

  async createFitness(fitness: FitnessItem): Promise<FitnessItem> {
    await this.docClient
      .put({
        TableName: this.fitnessTable,
        Item: fitness,
      })
      .promise();

    logger.info(`Saved new Fitness ${fitness.fitnessId} for user ${fitness.userId}`);

    return fitness;
  }

  async fitness(userId: string, fitnessId: string) {
    await this.docClient
      .update({
        TableName: this.fitnessTable,
        Key: {
          userId,
          fitnessId,
        },
        UpdateExpression: "set #available = :available",
        ExpressionAttributeValues: {
          ":available": "false",
        },
        ExpressionAttributeNames: {
          "#available": "available",
        },
      })
      .promise();
  }

  async availableFitness(userId: string, fitnessId: string) {
    await this.docClient
      .update({
        TableName: this.fitnessTable,
        Key: {
          userId,
          fitnessId,
        },
        UpdateExpression: "set #available = :available",
        ExpressionAttributeValues: {
          ":available": "true",
        },
        ExpressionAttributeNames: {
          "#available": "available",
        },
      })
      .promise();
  }

  async deleteFitness(userId: string, fitnessId: string) {
    await this.docClient
      .delete({
        TableName: this.fitnessTable,
        Key: {
          userId,
          fitnessId,
        },
      })
      .promise();

    logger.info(`Deleted fitness ${fitnessId}`);
  }

  async updateUrl(userId: string, fitnessId: string) {
    await this.docClient
      .update({
        TableName: this.fitnessTable,
        Key: {
          userId,
          fitnessId,
        },
        UpdateExpression: "set #attachmentUrl = :attachmentUrl",
        ExpressionAttributeValues: {
          ":attachmentUrl": `https://${this.bucketName}.s3.amazonaws.com/${fitnessId}`,
        },
        ExpressionAttributeNames: {
          "#attachmentUrl": "attachmentUrl",
        },
      })
      .promise();
  }
}

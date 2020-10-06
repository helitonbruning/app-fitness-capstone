import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CreateFitnessRequest } from "../../requests/CreateFitnessRequest";
import { getUserId } from "../utils";
import { createFitness } from "../../businessLogic/fitness";
import { createLogger } from "../../utils/logger";

const logger = createLogger("auth");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newFitness: CreateFitnessRequest = JSON.parse(event.body);
    const userId = getUserId(event);

    logger.info(`Received request for creating Fitness for user ${userId}...`);

    const item = await createFitness(newFitness, userId);

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        item,
      }),
    };
  }
);

handler.use(
  cors({
    credentials: true,
  })
);

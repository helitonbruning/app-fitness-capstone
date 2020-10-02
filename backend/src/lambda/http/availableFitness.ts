import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getUserId } from "../utils";
import { availableFitness } from "../../businessLogic/fitness";
import { createLogger } from "../../utils/logger";

const logger = createLogger("auth");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const fitnessId = event.pathParameters.fitnessId;
    const userId = getUserId(event);
    console.log('Fitness: PASSOU AQUI')
    if (!fitnessId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: "Missing fitnessIdId" }),
      };
    }

    logger.info(
      `Received request for making Fitness ${fitnessId} of user ${userId}...`
    );

    await availableFitness(userId, fitnessId);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({}),
    };
  }
);

handler.use(
  cors({
    credentials: true,
  })
);

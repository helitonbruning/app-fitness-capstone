import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { APIGatewayProxyResult } from "aws-lambda";
import { getAvailableFitness } from "../../businessLogic/fitness";
import { createLogger } from "../../utils/logger";

const logger = createLogger("auth");

export const handler = middy(
  async (): Promise<APIGatewayProxyResult> => {
    logger.info(
      `Received request for getting all available Fitness...`
    );

    const items = await getAvailableFitness();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        items,
      }),
    };
  }
);

handler.use(
  cors({
    credentials: true,
  })
);

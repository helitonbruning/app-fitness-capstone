import "source-map-support/register";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createLogger } from "../../utils/logger";
import * as AWS from "aws-sdk";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import * as AWSXRay from "aws-xray-sdk";
import { getUserId } from "../utils";
import { updateUrl } from "../../businessLogic/fitness";

const logger = createLogger("auth");

const XAWS = AWSXRay.captureAWS(AWS);

const s3 = new XAWS.S3({
  signatureVersion: "v4",
});

const bucketName = process.env.FITNESS_IMAGES_S3_BUCKET;
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION);

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const fitnessId = event.pathParameters.FitnessId;
    const userId = getUserId(event);

    if (!fitnessId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ error: "Missing fitnessId" }),
      };
    }

    logger.info(`Received request for generating signed URL for Fitness ${fitnessId}`);

    logger.info("Geting signed URL for Fitness...");

    await updateUrl(userId, fitnessId);

    const url = getUploadUrl(fitnessId);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        uploadUrl: url,
      }),
    };
  }
);

handler.use(
  cors({
    credentials: true,
  })
);

function getUploadUrl(fitnessId: string) {
  return s3.getSignedUrl("putObject", {
    Bucket: bucketName,
    Key: fitnessId,
    Expires: urlExpiration,
  });
}

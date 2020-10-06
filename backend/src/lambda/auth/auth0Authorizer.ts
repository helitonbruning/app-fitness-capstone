import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios from 'axios'
import { JwtPayload } from '../../auth/JwtPayload'
import { Jwt } from '../../auth/Jwt';

const logger = createLogger('auth')

const jwksUrl = 'https://dev-k5hu8rdu.us.auth0.com/.well-known/jwks.json'

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const response = await Axios.get(jwksUrl);
  //const jwks = response.data;
  //const keys:any[] = jwks.keys;
  
  //logger.info('jwks', jwks)

  const jwt: Jwt = decode(token, { complete: true }) as Jwt
  //Find the signing key in the filtered JWKS with a matching kid property.  
  const signingKey = response.data.keys.filter(key => key.kid === jwt.header.kid);
  logger.info('signingKey', signingKey)
  let certValue:string = signingKey.x5c[0];
  
  certValue = certValue.match(/.{1,64}/g).join('\n');
  const finalCertKey:string = `-----BEGIN CERTIFICATE-----\n${certValue}\n-----END CERTIFICATE-----\n`;
  //logger.info("finalCertKey - "+util.inspect(finalCertKey, false, null, true));
  logger.info('finalCertKey', finalCertKey)
 
  let jwtPayload:JwtPayload = verify(token, finalCertKey, { algorithms: ['RS256'] }) as JwtPayload; 
  return jwtPayload;
}

/*async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader);
  const jwt: Jwt = decode(token, { complete: true }) as Jwt;
  const jwtKid = jwt.header.kid;
  let cert: string | Buffer;

  console.info('token : ', token);

  try {
    const jwks = await Axios.get(jwksUrl);
    const signingKey = jwks.data.keys.filter(k => k.kid === jwtKid)[0];

    logger.info('signingKey', signingKey)

    if (!signingKey) {
      throw new Error(`Unable to find a signing key that matches '${jwtKid}'`);
    }
    
    logger.info('signingKey.x5c[0]', signingKey.x5c[0])
    const { x5c } = signingKey;

    cert = `-----BEGIN CERTIFICATE-----\n${x5c[0]}\n-----END CERTIFICATE-----`;
    console.info(cert );
  } catch (error) {
    console.info('Error While getting Certificate : ', error);
  }

  let jwtPayload:JwtPayload = verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload; 
  return jwtPayload
}*/

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

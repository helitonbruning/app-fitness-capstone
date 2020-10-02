## Fitness App

Now your newest app is available to save your workouts, photos from your smarwatch and more...

### Deploy Backend
* cd backend
* npm install
* sls deploy -v

### Update configuration
const apiId = 'w305b0p4h1'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-2.amazonaws.com/dev`

export const authConfig = {
  domain: 'dev-k5hu8rdu.us.auth0.com',
  clientId: 'scRG9J6mHZ57ATcySXz39OlK9bwuJ2Em',
  callbackUrl: 'http://localhost:3000/callback'
} 

### Frontend
* cd client
* npm install
* npm run start
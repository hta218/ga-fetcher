🚠  Fetch Google Analytics data with Google APIs in Node.js

# Installation
### Create Google App
1. Add new Project from [Google Console](https://console.developers.google.com/)
2. [Create Credentials](https://console.developers.google.com/apis/credentials) for your app (Select `Oauth Client ID` => `Web application` => `Create`)
3. Config URIs & Authorized redirect URIs in [Consent Screen](https://console.cloud.google.com/apis/credentials/consent)
    * URI example: http://localhost:6969
    * Redirect URI example: http://localhost:6969/auth/callback
4. Enable [Google Analytics API](https://console.developers.google.com/apis/api/analytics.googleapis.com/overview) (Go to Library => search `Analytics API` => Enable)

### Set up Nodejs Server
1. `git clone https://github.com/hta218/nodejs-google-api-starter.git`

2. Config `.env` file (Using `.env.example`)

3. `yarn && yarn start`

4. Sign in, get your view and fetch data

5. Learn how to create your request with [Google Analytics Reporting API v4](https://developers.google.com/analytics/devguides/reporting/core/v4/basics)

# License
[MIT License](https://opensource.org/licenses/MIT)

# Installation
1. Create new [Analytics Account](https://analytics.google.com/analytics/)
2. Add to PageFly by this [tutorial](https://help.pagefly.io/documentation/pagefly-integrate-with-google-analytics-to-track-my-page/)
3. Using [GA Reporting API](https://developers.google.com/analytics/devguides/reporting/core/v4/quickstart/web-js) v4 to get GA's data
  * Enable API by using the [setup tool](https://console.developers.google.com/flows/enableapi?apiid=analyticsreporting.googleapis.com&credential=client_key) (Go to Library => search for GA api => Enable)
  * Config [consent screen](https://console.cloud.google.com/apis/credentials/consent) to get Client ID

4. Setup the sample by replace the CLIENT_ID and VIEW_ID in `GA.html`

5. Rung `node server.js` to start server and sign in to your google account to see the data from GA
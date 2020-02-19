import express from 'express'
import { google } from 'googleapis'
import { oauth2Client } from './auth'

const router = express.Router()
const googleAccounts = google.analytics('v3')
const googleAnalytics = google.analyticsreporting('v4')

router.get('/view', (req, res) => {
  const credentials = JSON.parse(req.cookies['tokens'])
  oauth2Client.setCredentials(credentials)

  googleAccounts.management.profiles.list(
    {
      accountId: '~all',
      webPropertyId: '~all',
      auth: oauth2Client
    },
    (err, profiles) => {
      if (err) {
        res.json({ success: 0, err: err.toString() })
      } else if (profiles) {
        let views = []
        profiles.data.items.forEach(({ id, webPropertyId, name, websiteUrl }) => {
          views.push({
            name: `${webPropertyId} - ${name} (${websiteUrl})`,
            id
          })
        })
        res.json({ success: 1, message: "Use a viewId as a request's query parameter to fetch Google Analytics data", views, profiles })
      }
    }
  )
})

router.get('/data', (req, res) => {
  const credentials = JSON.parse(req.cookies['tokens'])
  oauth2Client.setCredentials(credentials)

  const { viewId } = req.query

  googleAnalytics.reports.batchGet({
    auth: oauth2Client,
    requestBody: {
      reportRequests: [
        {
          viewId,
          dateRanges: [
            { startDate: "7daysAgo", endDate: "yesterday" }
          ],
          metrics: [
            { expression: "ga:users" },
            { expression: "ga:avgSessionDuration" },
          ],
          dimensions: [
            { name: 'ga:pagePath' },
            { name: 'ga:date' },
          ]
        },
      ]
    }
  }, (err, payload) => {
    if (err) {
      res.json({ success: 0, err: err.toString() })
    } else {
      res.json({ success: 1, payload })
    }
  })
})

export default router

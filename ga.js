import express from 'express'
import { google } from 'googleapis'
import { oauth2Client } from './auth'

const router = express.Router()
const googleAccounts = google.analytics('v3')
const googleAnalytics = google.analyticsreporting('v4')

router.get('/view', (req, res) => {
  const { url = "", access_token = "" } = req.query
  oauth2Client.setCredentials({ access_token })

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
          if (websiteUrl.includes(url)) {
            views.push({
              name: `${webPropertyId} - ${name} (${websiteUrl})`,
              id
            })
          }
        })
        res.json({ success: 1, views, profiles })
      }
    }
  )
})

router.post('/data', (req, res) => {
  const { resource, access_token } = req.body
  console.log('=================>', resource, access_token, req.body)
  if (resource && access_token) {
    oauth2Client.setCredentials({ access_token })
  } else {
    res.json({ success: 0, message: 'Missing request data' })
  }

  googleAnalytics.reports.batchGet({
    headers: { 'Content-Type': 'application/json' },
    auth: oauth2Client,
    resource
  }, (err, payload) => {
    if (err) {
      res.json({ success: 0, err: err.toString() })
    }
    try {
      let results = []
      let days = []
      payload.data.reports[0].data.rows.forEach(row => {
        days.push(row.dimensions[0])
        results.push(row.metrics[0].values[0])
      })
      res.json({ success: 1, results, days, payload })
    } catch(e) { res.json({ success: 0, msg: 'PF:: Error when extracting data', err }) }
  })
})

export default router

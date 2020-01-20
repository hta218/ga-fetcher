import express from 'express'
import { google } from 'googleapis'
import { oauth2Client } from './auth'

const router = express.Router()
const googleAccounts = google.analytics('v3')
const googleAnalytics = google.analyticsreporting('v4')

router.get('/view', (req, res) => {
  googleAccounts.management.profiles.list(
    {
      accountId: '~all',
      webPropertyId: '~all',
      auth: oauth2Client
    },
    (err, profiles) => {
      if (err) {
        console.error('Error: ' + err)
        res.json({ success: 0, err })
      } else if (profiles) {
        let views = []
        profiles.data.items.forEach(view => {
          views.push({
            name: view.webPropertyId + ' - ' + view.name + ' (' + view.websiteUrl + ')',
            id: view.id
          })
        })
        res.json({ success: 1, views })
      }
    }
  )
})

router.get('/data', (req, res) => {
  const { access_token, viewId } = req.query
  console.log('=================>', access_token, viewId)
  // const access_token = 'ya29.Il-6BxZSg_6IMoz3xbmlkGtddmEKyKauceegNl-6z4eECgCRbyCqw2c51dDCckmQM0t84AnDiXfEnElj8ZtU5lMmJqI4Bp1JoJj2SIWTZyzEhLXG4x0sM5LxsfRLsmjlVA'
  if (access_token) {
    oauth2Client.setCredentials({ access_token })
  } else {
    res.json({ success: 0, message: 'Missing access_token' })
  }

  googleAnalytics.reports.batchGet({
    headers: { 'Content-Type': 'application/json' },
    auth: oauth2Client,
    resource: {
      reportRequests: [
        {
          viewId,
          dateRanges: [
            { startDate: '2019-12-23', endDate: '2020-01-15' },
            // { startDate: '2020-01-01', endDate: '2020-01-15' },
          ],
          metrics: [
            {
              expression: 'ga:avgSessionDuration'
            }
          ],
          dimensions: [
            {
              name: 'ga:date'
            }
          ]
        }
      ]
    }
  }, (err, payload) => {
    if (err) {
      res.json({ success: 0, msg: `Error code ${err.code} - ${err.errors[0].message}` })
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

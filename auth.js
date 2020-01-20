import express from 'express'
import { google } from 'googleapis'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const VIEW_ID = process.env.VIEW_ID
const PAGEFLY_URL = process.env.PAGEFLY_URL
const REDIRECT_URI = 'http://localhost:6969/auth/google/callback'

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

const url = oauth2Client.generateAuthUrl({
  access_type: 'online',
	scope: 'https://www.googleapis.com/auth/analytics.readonly'
})

router.get('/google/signin', (req, res) => res.redirect(url))

router.get('/google/callback', (req, res) => {
  oauth2Client.getToken(req.query.code, (err, tokens) => {
    if (err) {
      res.json({ success: 0, err })
    } else {
      oauth2Client.setCredentials({ access_token: tokens.access_token })
      // res.cookie('access_token', tokens.access_token)
      // res.cookie('googleAuth', new Date())
      // res.json({ tokens })
      res.location(`${PAGEFLY_URL}/analytics`)
    }
  })
})

export default router
export { oauth2Client }
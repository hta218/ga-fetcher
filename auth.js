import express from 'express'
import { google } from 'googleapis'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const PORT = process.env.PORT || 6969
const REDIRECT_URI = `http://localhost:${PORT}/auth/callback`

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

const redirectURL = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: 'https://www.googleapis.com/auth/analytics.readonly'
})

router.get('/signin', (req, res) => res.redirect(redirectURL))

router.get('/callback', async (req, res) => {
  const { tokens } = await oauth2Client.getToken(req.query.code)

  // ..... save 'tokens' to database

  res.cookie('tokens', JSON.stringify(tokens))
  res.json({ success: 0, message: 'Sign in sucessfully', tokens })
})

export default router
export { oauth2Client }
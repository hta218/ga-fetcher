import express from 'express'
import session from 'express-session'
import cookieParser from 'cookie-parser'

import authRouter from './auth'
import gaRouter from './ga'

const port = process.env.PORT || 6969
const app = express()

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: 'xcvbnadqwo1234', resave: true, saveUninitialized: true }))

app.get('/', (req, res) => {
  const baseURL = `http://localhost:${port}`
  res.json({
    success: 1, 
    message: "Server start successfully!",
    signInUrl: `${baseURL}/auth/signin`,
    view: `${baseURL}/ga/view`,
    data: `${baseURL}/ga/data`,
  })
})

app.use('/ga', gaRouter)
app.use('/auth', authRouter)

app.listen(port, () => {
  console.log(`App running on port ${port}! Visit http://localhost:${port} to view all routers`)
})

import express from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import mongoose from 'mongoose'

import authRouter from './auth'
import gaRouter from './ga'

const port = process.env.PORT || 6969
const MONGODB_URI = process.env.MONGODB_URI
const app = express()

app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: 'xcvbnadqwo1234', resave: true, saveUninitialized: true }))

// mongoose.connect(MONGODB_URI, { useNewUrlParser: true })

app.get('/', (req, res) => {
  res.json({ test: 'ok' })
})

app.use('/ga', gaRouter)
app.use('/auth', authRouter)

app.listen(port, () => {
  console.log(`App running on port ${port}!`)
})

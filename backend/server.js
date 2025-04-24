const express = require('express')
const cors = require('cors')
require('dotenv').config()

const requireUser = require('./middleware/auth')
const generateRoute = require('./routes/generateImage')
const editRoute = require('./routes/editImage')
const historyRoute = require('./routes/history')

const app = express()

// Core middleware
app.use(cors())
app.use(express.json({ limit: '25mb' }))
app.use(express.urlencoded({ extended: true, limit: '25mb' }))

// Attach auth to each API route individually
app.use('/api/generate', requireUser, generateRoute)
app.use('/api/edit', requireUser, editRoute)
app.use('/api/history', requireUser, historyRoute)

app.listen(3001, '127.0.0.1', () => {
  console.log('✅ Backend running on http://127.0.0.1:3001')
})

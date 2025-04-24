const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(express.json())
 
app.use((req, res, next) => {
    req.user = req.headers['x-user'] || null
    next()
  })

const requireUser = require('./middleware/auth')
app.use('/api', requireUser)

const generateRoute = require('./routes/generateImage')
app.use('/api/generate', generateRoute)

const editRoute = require('./routes/editImage')
app.use('/api/edit', editRoute)

const historyRoute = require('./routes/history')
app.use('/api/history', historyRoute)

app.listen(3001, '127.0.0.1', () => {
    console.log('Backend running on http://127.0.0.1:3001')
  })
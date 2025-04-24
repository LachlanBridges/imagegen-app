const express = require('express')
const fs = require('fs')
const path = require('path')

const router = express.Router()

const HISTORY_DIR = path.join(__dirname, '..', 'data')
if (!fs.existsSync(HISTORY_DIR)) fs.mkdirSync(HISTORY_DIR)

function getHistoryPath(user) {
  return path.join(HISTORY_DIR, `history_${user}.json`)
}

router.post('/', (req, res) => {
  const user = req.user
  const { prompt, settings, images } = req.body

  if (!user || !prompt || !images || !Array.isArray(images)) {
    return res.status(400).json({ error: 'Invalid request' })
  }

  const filepath = getHistoryPath(user)
  const timestamp = new Date().toISOString()
  const entry = { prompt, settings, images, timestamp }

  let history = []
  if (fs.existsSync(filepath)) {
    try {
      history = JSON.parse(fs.readFileSync(filepath, 'utf-8'))
    } catch (err) {
      console.warn('[History Parse Error]', err)
    }
  }

  history.push(entry)

  try {
    fs.writeFileSync(filepath, JSON.stringify(history, null, 2))
    res.json({ ok: true })
  } catch (err) {
    console.error('[History Save Error]', err)
    res.status(500).json({ error: 'Failed to save history' })
  }
})

router.get('/', (req, res) => {
  const user = req.user
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  const filepath = getHistoryPath(user)

  if (!fs.existsSync(filepath)) return res.json([])

  try {
    const raw = fs.readFileSync(filepath, 'utf-8')
    const data = JSON.parse(raw)
    res.json(data)
  } catch (err) {
    console.error('[History Read Error]', err)
    res.status(500).json({ error: 'Failed to read history' })
  }
})

module.exports = router

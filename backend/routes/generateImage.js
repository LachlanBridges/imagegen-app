const express = require('express')
const axios = require('axios')
const router = express.Router()

router.post('/', async (req, res) => {
  const {
    prompt,
    model = 'gpt-image-1',
    size = '1024x1024',
    background = 'auto',
    output_format = 'b64_json',
    quality = 'auto',
    moderation = 'auto',
    n = 1,
  } = req.body

  if (!prompt) return res.status(400).json({ error: 'Missing prompt' })

  const payload = {
    prompt,
    model,
    size,
    output_format,
    n: parseInt(n),
    background,
    quality,
    moderation,
    ...(req.user && { user: req.user }),
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    res.json(response.data)
  } catch (err) {
    console.error('[GENERATION ERROR]', err.response?.data || err.message)
    res.status(500).json({ error: 'generation failed', detail: err.message })
  }
})

module.exports = router

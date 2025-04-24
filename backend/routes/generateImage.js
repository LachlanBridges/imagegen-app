const express = require('express')
const axios = require('axios')
const router = express.Router()

router.post('/', async (req, res) => {
  const {
    prompt,
    model = 'dall-e-3',
    size = '1024x1024',
    background,
    output_format = 'b64_json',
    quality = 'auto',
    moderation = 'auto',
    n = 1,
  } = req.body

  const payload = {
    prompt,
    model,
    size,
    n,
    response_format: output_format,
    ...(background && { background }),
    ...(quality && { quality }),
    ...(moderation && { moderation }),
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

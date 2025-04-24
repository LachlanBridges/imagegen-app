const express = require('express')
const axios = require('axios')
const multer = require('multer')
const FormData = require('form-data')
const fs = require('fs')

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

router.post('/', upload.array('images'), async (req, res) => {
  const {
    prompt,
    size = '1024x1024',
    quality = 'auto',
    moderation = 'auto',
    n = 1,
  } = req.body

  const [image, mask] = req.files || []
  if (!image) return res.status(400).json({ error: 'Missing image upload' })

  const form = new FormData()
  form.append('prompt', prompt)
  form.append('size', size)
  form.append('n', parseInt(n))
  form.append('image', fs.createReadStream(image.path), {
    filename: image.originalname,
    contentType: image.mimetype,
  })
  form.append('model', 'gpt-image-1')

  if (mask) form.append('mask', fs.createReadStream(mask.path))
  if (quality) form.append('quality', quality)
  if (moderation) form.append('moderation', moderation)
  if (req.user) form.append('user', req.user)

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/images/edits',
      form,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          ...form.getHeaders(),
        },
      }
    )

    res.json(response.data)
  } catch (err) {
    console.error('[EDIT ERROR]', err.response?.data || err.message)
    res.status(500).json({ error: 'edit failed', detail: err.message })
  } finally {
    if (image) fs.unlinkSync(image.path)
    if (mask) fs.unlinkSync(mask.path)
  }
})

module.exports = router

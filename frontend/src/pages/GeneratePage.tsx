import { api } from '@/lib/api'
import { APIImage, HistoryEntry } from '@/lib/types'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ImageViewer from '../components/ImageViewer'
import { estimateCost } from '../lib/estimateCost'
const FORMATS = ['png', 'jpeg', 'webp']
const SIZES = ['1024x1024', '1536x1024', '1024x1536']
const BACKGROUNDS = ['auto', 'transparent', 'opaque']
const QUALITIES = ['auto', 'low', 'medium', 'high']
const MODERATIONS = ['auto', 'low']
const COUNTS = [1, 2, 3, 4, 5]


interface LocationState {
  prompt?: string
  settings?: {
    size: string
    quality: string
    format: string
    background: string
    moderation: string
    count: number
  }
  frozen?: boolean
}


type GeneratedImage = {
  b64: string
  prompt: string
}

function GeneratePage() {
  const location = useLocation()
  const navigate = useNavigate()

  const [prompt, setPrompt] = useState('')
  const [format, setFormat] = useState('png')
  const [size, setSize] = useState('1024x1024')
  const [background, setBackground] = useState('auto')
  const [quality, setQuality] = useState('auto')
  const [moderation, setModeration] = useState('auto')
  const [count, setCount] = useState(1)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [loading, setLoading] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [locked, setLocked] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_unused, setHistory] = useState<HistoryEntry[]>([])


  useEffect(() => {
    api.get('/history').then((res) => {
      setHistory(res.data.reverse()) // show newest first
    })
  }, [])
  
  const hardReset = () => {
    setPrompt('')
    setFormat('png')
    setSize('1024x1024')
    setBackground('auto')
    setQuality('auto')
    setModeration('auto')
    setCount(1)
    setImages([])
    setImageFiles([])
    setCurrentIndex(0)
    setLocked(false)
  }

  useEffect(() => {
    const state = location.state as LocationState

    if (state?.prompt) {
        setPrompt(state.prompt)
        if (state.settings) {
        setSize(state.settings.size)
        setQuality(state.settings.quality)
        setFormat(state.settings.format)
        setBackground(state.settings.background)
        setModeration(state.settings.moderation)
        setCount(state.settings.count)
        }
        setImages([])
        setImageFiles([])
        setCurrentIndex(0)
        setLocked(state.frozen ?? false)
    } else {
        hardReset()
    }
    }, [location.state])
  
  
  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || [])
    setImageFiles((prev) => [...prev, ...newFiles])
    e.target.value = ''
  }

//   const removeFile = (index: number) => {
//     setImageFiles((prev) => prev.filter((_, i) => i !== index))
//   }

  const reset = () => {
    setPrompt('')
    setImages([])
    setImageFiles([])
    setCurrentIndex(0)
    setLocked(false)
  }

  const generate = async () => {
    setLoading(true)
    setImages([])

    try {
        let newImages: GeneratedImage[] = []

        if (imageFiles.length > 0) {
        const formData = new FormData()
        formData.append('prompt', prompt)
        formData.append('size', size)
        formData.append('quality', quality)
        formData.append('n', String(count))
        formData.append('moderation', moderation)
        imageFiles.forEach((file) => {
            formData.append('images', file)
        })

        const res = await api.post('/edit', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })

        newImages = (res.data.data as APIImage[]).map((d) => ({
            b64: `data:image/png;base64,${d.b64_json}`,
            prompt,
          }))
        } else {
        const res = await api.post('/generate', {
            prompt,
            model: 'gpt-image-1',
            size,
            output_format: format,
            background,
            quality,
            moderation,
            n: count,
        })

        newImages = (res.data.data as APIImage[]).map((d) => ({
            b64: `data:image/${format};base64,${d.b64_json}`,
            prompt,
            }))
        }

        // Save locally
        setImages(newImages)
        setCurrentIndex(0)
        setLocked(true)

        // Save to history
        await api.post('/history', {
        user: 'lachlan',
        prompt,
        settings: {
            size,
            quality,
            format,
            background,
            moderation,
            count,
        },
        images: newImages.map((img) => img.b64),
        })
    } catch (err) {
        console.error('[Image Generation Error]', err)
        alert('Image generation failed')
    }

    setLoading(false)
    }


  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">Image Generator</h1>

      {locked && (
        <div className="flex justify-center">
        <button
        onClick={() => {
            navigate('/')
            hardReset()
        }}
        className="w-full bg-gray-600 text-white p-2 rounded"
        >
        🔁 Reset / New Prompt
        </button>
        </div>
        )}


      <textarea
        className="w-full border p-2 rounded"
        rows={4}
        placeholder="Describe your image..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={locked || loading}
      />

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFilesChange}
        className="w-full p-2 border rounded"
        disabled={locked || loading}
      />

        {images.length > 0 && (
        <ImageViewer
            images={images}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
        />
        )}

      <div className="grid grid-cols-2 gap-2">
        <select
          className="p-2 border rounded"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          disabled={locked || loading || imageFiles.length > 0}
        >
          {FORMATS.map((f) => (
            <option key={f} value={f}>
              Format: {f}
            </option>
          ))}
        </select>

        <select
          className="p-2 border rounded"
          value={background}
          onChange={(e) => setBackground(e.target.value)}
          disabled={locked || loading || imageFiles.length > 0}
        >
          {BACKGROUNDS.map((b) => (
            <option key={b} value={b}>
              Background: {b}
            </option>
          ))}
        </select>

        <select
          className="p-2 border rounded"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          disabled={locked || loading}
        >
          {SIZES.map((s) => (
            <option key={s} value={s}>
              Size: {s}
            </option>
          ))}
        </select>

        <select
          className="p-2 border rounded"
          value={quality}
          onChange={(e) => setQuality(e.target.value)}
          disabled={locked || loading}
        >
          {QUALITIES.map((q) => (
            <option key={q} value={q}>
              Quality: {q}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <select
          className="p-2 border rounded"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          disabled={locked || loading}
        >
          {COUNTS.map((n) => (
            <option key={n} value={n}>
              Number of images: {n}
            </option>
          ))}
        </select>

        <select
          className="p-2 border rounded"
          value={moderation}
          onChange={(e) => setModeration(e.target.value)}
          disabled={locked || loading}
        >
          {MODERATIONS.map((m) => (
            <option key={m} value={m}>
              Moderation: {m}
            </option>
          ))}
        </select>
      </div>

      <div className="text-sm text-gray-600 text-center">
        Estimated cost: ~$
        {estimateCost({
          size,
          quality,
          n: count,
        }).toFixed(2)}
      </div>

      {locked ? (
        <button
          onClick={reset}
          className="w-full bg-gray-600 text-white p-2 rounded"
        >
          🔁 Reset / New Prompt
        </button>
      ) : (
        <button
          onClick={generate}
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
        >
          {loading
            ? 'Generating...'
            : imageFiles.length
            ? 'Edit Image(s)'
            : 'Generate Image'}
        </button>
      )}
    </div>
  )
}

export default GeneratePage

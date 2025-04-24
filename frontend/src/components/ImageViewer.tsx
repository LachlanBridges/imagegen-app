

type Props = {
  images: { b64: string; prompt: string }[]
  currentIndex: number
  setCurrentIndex: (i: number) => void
}

export default function ImageViewer({ images, currentIndex, setCurrentIndex }: Props) {
  const img = images[currentIndex]

  return (
    <div className="space-y-2 border rounded p-2">
      <img src={img.b64} alt={`Generated ${currentIndex}`} className="w-full rounded" />

      <div className="text-xs text-gray-500 mt-1 text-center">
        Prompt: {img.prompt}
      </div>

      <div className="flex justify-between items-center mt-2">
        <button
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          ⬅ Prev
        </button>

        <div className="text-sm text-gray-700">
          {currentIndex + 1} / {images.length}
        </div>

        <button
          onClick={() => setCurrentIndex((i) => Math.min(images.length - 1, i + 1))}
          disabled={currentIndex === images.length - 1}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Next ➡
        </button>
      </div>

      <div className="flex justify-center mt-2">
        <button
          onClick={() => {
            const a = document.createElement('a')
            a.href = img.b64
            a.download = `image_${currentIndex}.png`
            a.click()
          }}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          Download
        </button>
      </div>
    </div>
  )
}

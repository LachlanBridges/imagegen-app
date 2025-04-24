type Props = {
    prompt: string
    timestamp: string
    images: string[]
    onReuse?: () => void
  }
  
  export default function HistoryCard({ prompt, timestamp, images, onReuse }: Props) {
    return (
      <div className="border p-3 rounded space-y-2">
        <div className="font-semibold text-lg">{prompt}</div>
        <div className="text-xs text-gray-500">{new Date(timestamp || Date.now()).toLocaleString()
        }</div>
  
        <div className="grid grid-cols-2 gap-2">
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Generated ${i}`}
              className="w-full rounded border object-cover max-h-48"
            />
          ))}
        </div>
  
        {onReuse && (
          <div className="text-center">
            <button
            onClick={onReuse}
            className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
            >
            👁️ View
            </button>
          </div>
        )}
      </div>
    )
  }
  
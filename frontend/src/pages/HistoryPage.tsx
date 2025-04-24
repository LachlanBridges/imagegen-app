import { HistoryEntry } from '@/lib/types'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HistoryCard from '../components/HistoryCard'

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('/api/history').then((res) => {
      setHistory(res.data.reverse())
    })
  }, [])

  return (
    <div className="space-y-4 max-w-xl mx-auto p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">📜 History</h2>
        <button
          onClick={() => navigate('/')}
          className="text-sm bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800"
        >
          + New Prompt
        </button>
      </div>

      {history.length === 0 ? (
        <div className="text-center text-gray-500">No history found.</div>
      ) : (
        history.map((entry, idx) => (
          <HistoryCard
            key={idx}
            prompt={entry.prompt}
            timestamp={new Date(entry.timestamp || Date.now()).toLocaleString()}
            images={entry.images}
            onReuse={() =>
              navigate('/', {
                state: {
                  prompt: entry.prompt,
                  settings: entry.settings,
                  frozen: true,
                },
              })
            }
          />
        ))
      )}
    </div>
  )
}

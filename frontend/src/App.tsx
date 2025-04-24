import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import GeneratePage from './pages/GeneratePage'
import HistoryPage from './pages/HistoryPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="max-w-xl mx-auto p-4">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">🖼 ImageGen</h1>
          <Link to="/history" className="text-blue-600 underline text-sm">
            View History
          </Link>
        </div>

        <Routes>
          <Route path="/" element={<GeneratePage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

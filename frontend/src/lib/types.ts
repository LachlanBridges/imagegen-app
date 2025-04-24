export type HistoryEntry = {
    prompt: string
    timestamp: string
    settings: {
      size: string
      quality: string
      format: string
      background: string
      moderation: string
      count: number
    }
    images: string[]
  }

  export type APIImage = { b64_json: string }

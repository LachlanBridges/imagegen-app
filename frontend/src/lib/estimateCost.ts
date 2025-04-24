export function estimateCost({
    size,
    quality,
    n,
  }: {
    size: string
    quality: string
    n: number
  }): number {
    const baseCosts: Record<string, number> = {
      low: 0.02,
      medium: 0.07,
      high: 0.19,
      auto: 0.07,
    }
  
    const sizeMultiplier =
      size === '1536x1024' || size === '1024x1536' ? 1.5 : 1.0
  
    const costPerImage = baseCosts[quality] || 0.07
  
    return costPerImage * sizeMultiplier * n
  }
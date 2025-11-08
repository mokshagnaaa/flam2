import { NextResponse } from 'next/server'
import { generateInitialDataset } from '../../../lib/dataGenerator'

export async function GET() {
  const payload = {
    generatedAt: Date.now(),
    data: generateInitialDataset(200)
  }

  return NextResponse.json(payload)
}

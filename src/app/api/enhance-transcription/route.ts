import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { transcription, instruction } = await request.json()

    if (!transcription || !instruction) {
      return NextResponse.json(
        { error: 'transcription and instruction are required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      // eslint-disable-next-line no-console
      console.error('GEMINI_API_KEY is not set')
      return NextResponse.json(
        { error: 'Server misconfiguration' },
        { status: 500 }
      )
    }

    const prompt = `You are a helpful assistant that transforms video transcriptions based on user instructions.

Original transcription:
${transcription}

Instruction: ${instruction}

Return only the modified transcription text, with no additional commentary or explanation.`

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    )

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      // eslint-disable-next-line no-console
      console.error('Gemini API error:', err)
      return NextResponse.json(
        { error: 'Failed to call Gemini API' },
        { status: 502 }
      )
    }

    const data = await res.json()
    const result: string =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

    return NextResponse.json({ result })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error enhancing transcription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

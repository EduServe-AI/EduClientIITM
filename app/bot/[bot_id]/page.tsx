import { Metadata } from 'next'
import BotPreviewClient from './botPreviewClient'

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'
const STORAGE_URL =
  process.env.NEXT_PUBLIC_STORGAE_URL ||
  'https://eduservebs.blob.core.windows.net'

interface BotData {
  id: string
  name: string
  description: string
  level: string
  numInteractions: number
  courseId?: string
  course?: {
    id: string
    name: string
  }
}

async function getBotDetails(botId: string): Promise<BotData | null> {
  try {
    const response = await fetch(`${API_URL}/bot/${botId}`, {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      next: { revalidate: 300 },
    })

    if (!response.ok) return null

    const json = await response.json()
    // Handle various response shapes from the backend
    return json?.data?.bot || json?.data || json?.bot || json
  } catch {
    return null
  }
}

// Dynamic OG metadata — this is what makes the link preview show on WhatsApp, etc.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ bot_id: string }>
}): Promise<Metadata> {
  const { bot_id } = await params
  const bot = await getBotDetails(bot_id)

  const title = bot ? `Chat with ${bot.name} | Eduserve AI` : 'Eduserve AI'
  const description = bot
    ? bot.description.slice(0, 160)
    : 'On Demand Human and AI Teaching Assistance'
  const botImageUrl = bot
    ? `${STORAGE_URL}/botimages/${bot.name}.jpg`
    : undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'Eduserve AI',
      ...(botImageUrl && {
        images: [
          {
            url: botImageUrl,
            width: 1200,
            height: 630,
            alt: bot ? `${bot.name} - AI Tutor` : 'Eduserve AI',
          },
        ],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(botImageUrl && { images: [botImageUrl] }),
    },
  }
}

export default async function BotPreviewPage({
  params,
}: {
  params: Promise<{ bot_id: string }>
}) {
  const { bot_id } = await params
  const bot = await getBotDetails(bot_id)

  return <BotPreviewClient bot={bot} botId={bot_id} />
}

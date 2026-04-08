import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    telegram_token: process.env.TELEGRAM_TOKEN,
    telegram_chat_id: process.env.TELEGRAM_CHAT_ID,
  })
}

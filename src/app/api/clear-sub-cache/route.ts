import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ cleared: true })
  res.cookies.set('x-sub-status', '', {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  })
  return res
}

import { NextResponse } from 'next/server';
import { connectionDB } from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Attempting connection...');
    await connectionDB();
    console.log('Connected!')
    return NextResponse.json({ message: 'MongoDB connected successfully!' });
  } catch (error) {
    console.error('Connection error:', error);
    return NextResponse.json(
      { 
        error: 'MongoDB connection failed', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}

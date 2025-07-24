// app/api/demo/route.ts
import { NextResponse } from 'next/server';

// TEMP: define DemoResponse directly
type DemoResponse = {
  message: string;
};

export async function GET() {
  const response: DemoResponse = {
    message: 'Hello from the demo endpoint',
  };

  return NextResponse.json(response);
}

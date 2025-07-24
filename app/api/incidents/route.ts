import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { IncidentsResponse } from '@/shared/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const resolved = searchParams.get('resolved');
    
    const whereClause = resolved !== null ? { resolved: resolved === 'true' } : {};

    const incidents = await prisma.incident.findMany({
      where: whereClause,
      include: {
        camera: true
      },
      orderBy: {
        tsStart: 'desc' // newest first
      }
    });

    const response: IncidentsResponse = {
      incidents: incidents.map(incident => ({
        id: incident.id,
        cameraId: incident.cameraId,
        type: incident.type,
        tsStart: incident.tsStart.toISOString(),
        tsEnd: incident.tsEnd?.toISOString() || null,
        thumbnailUrl: incident.thumbnailUrl,
        resolved: incident.resolved,
        camera: incident.camera
      })),
      total: incidents.length
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching incidents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch incidents' },
      { status: 500 }
    );
  }
}

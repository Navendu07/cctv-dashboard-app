import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  context: any // <= use 'any' here to skip type errors
) {
  const { id } = context.params;

  if (!id) {
    return NextResponse.json({ error: 'Missing incident ID' }, { status: 400 });
  }

  try {
    const existingIncident = await prisma.incident.findUnique({
      where: { id },
      include: { camera: true },
    });

    if (!existingIncident) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }

    const updatedIncident = await prisma.incident.update({
      where: { id },
      data: { resolved: !existingIncident.resolved },
      include: { camera: true },
    });

    return NextResponse.json({
      success: true,
      incident: {
        id: updatedIncident.id,
        cameraId: updatedIncident.cameraId,
        type: updatedIncident.type,
        tsStart: updatedIncident.tsStart.toISOString(),
        tsEnd: updatedIncident.tsEnd?.toISOString() || null,
        thumbnailUrl: updatedIncident.thumbnailUrl,
        resolved: updatedIncident.resolved,
        camera: updatedIncident.camera,
        aiAnalysis: undefined,
        confidence: 0,
        boundingBox: undefined,
        description: undefined,
        severity: '',
        status: '',
      },
    });
  } catch (error) {
    console.error('Error resolving incident:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

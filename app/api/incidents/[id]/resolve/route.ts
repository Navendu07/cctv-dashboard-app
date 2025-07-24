import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ResolveIncidentResponse } from '@/shared/api';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Find the incident first
    const existingIncident = await prisma.incident.findUnique({
      where: { id },
      include: { camera: true }
    });

    if (!existingIncident) {
      return NextResponse.json(
        { error: 'Incident not found' },
        { status: 404 }
      );
    }

    // Flip the resolved status
    const updatedIncident = await prisma.incident.update({
      where: { id },
      data: { resolved: !existingIncident.resolved },
      include: { camera: true }
    });

    const response: ResolveIncidentResponse = {
      incident: {
        id: updatedIncident.id,
        cameraId: updatedIncident.cameraId,
        type: updatedIncident.type,
        tsStart: updatedIncident.tsStart.toISOString(),
        tsEnd: updatedIncident.tsEnd?.toISOString() || null,
        thumbnailUrl: updatedIncident.thumbnailUrl,
        resolved: updatedIncident.resolved,
        camera: updatedIncident.camera
      },
      success: true
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error resolving incident:', error);
    return NextResponse.json(
      { error: 'Failed to resolve incident' },
      { status: 500 }
    );
  }
}

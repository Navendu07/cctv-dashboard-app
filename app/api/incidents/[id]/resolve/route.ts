import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ResolveIncidentResponse } from '@/shared/api';

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

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
        tsEnd: updatedIncident.tsEnd ? new Date(updatedIncident.tsEnd).toISOString() : null,
        thumbnailUrl: updatedIncident.thumbnailUrl,
        resolved: updatedIncident.resolved,
        camera: updatedIncident.camera,
        aiAnalysis: undefined,
        confidence: 0,
        boundingBox: undefined,
        description: undefined,
        severity: '',
        status: ''
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

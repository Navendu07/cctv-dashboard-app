import { ReactNode } from "react";

export type Camera = {
  id: string;
  name: string;
  location: string;
  streamUrl?: string;
};

export type Incident = {
  aiAnalysis: any;
  confidence: number;
  boundingBox: any;
  description: ReactNode;
  severity: string;
  status: string;
  id: string;
  cameraId: string;
  type: string;
  tsStart: string; // ISO string from .toISOString()
  tsEnd: string | null;
  thumbnailUrl: string;
  resolved: boolean;
  camera: Camera;
  timestamp?: string; // Optional — remove if unused
};

export type ResolveIncidentResponse = {
  incident: Incident;
  success: boolean;
};

export type IncidentsResponse = {
  incidents: Incident[];
  total: number;
  success: boolean;
};

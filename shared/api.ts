/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Camera data structure (from database)
 */
export interface Camera {
  id: string;
  name: string;
  location: string;
}

/**
 * Incident data structure (from database)
 */
export interface Incident {
  id: string;
  cameraId: string;
  type: string;
  tsStart: string; // ISO date string
  tsEnd: string | null; // ISO date string or null for ongoing
  thumbnailUrl: string;
  resolved: boolean;
  camera?: Camera; // Optional populated camera data
}

/**
 * API response for incidents list
 */
export interface IncidentsResponse {
  incidents: Incident[];
  total: number;
}

/**
 * API response for resolving an incident
 */
export interface ResolveIncidentResponse {
  incident: Incident;
  success: boolean;
}

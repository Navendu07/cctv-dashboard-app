'use client'

import { useState, useEffect } from "react";
import { MandlacNavbar } from "@/components/MandlacNavbar";
import { MandatoryIncidentPlayer } from "@/components/MandatoryIncidentPlayer";
import { MandatoryIncidentList } from "@/components/MandatoryIncidentList";
import { Incident, Camera } from "@/shared/api";

export function MandatoryDashboard() {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [cameras, setCameras] = useState<Camera[]>([]);

  useEffect(() => {
    // Fetch cameras for the incident player
    const fetchCameras = async () => {
      try {
        const response = await fetch('/api/cameras');
        const data = await response.json();
        setCameras(data.cameras);
      } catch (error) {
        console.error("Error fetching cameras:", error);
      }
    };

    fetchCameras();
  }, []);

  const handleSelectIncident = (incident: Incident) => {
    setSelectedIncident(incident);
  };

  return (
    <div className="h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Navigation */}
      <MandlacNavbar />

      {/* Main Content - Split Layout */}
      <div className="flex-1 flex gap-6 p-6 overflow-hidden">
        {/* Left Side - Incident Player */}
        <div className="flex-1">
          <MandatoryIncidentPlayer
            selectedIncident={selectedIncident}
            cameras={cameras}
          />
        </div>

        {/* Right Side - Incident List */}
        <div className="w-96 flex-shrink-0">
          <MandatoryIncidentList
            selectedIncident={selectedIncident}
            onSelectIncident={handleSelectIncident}
          />
        </div>
      </div>
    </div>
  );
}

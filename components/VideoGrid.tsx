import { useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2, Camera, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CameraFeed {
  id: string;
  name: string;
  location: string;
  isOnline: boolean;
  isActive: boolean;
  timestamp: string;
}

const mockCameraFeeds: CameraFeed[] = [
  {
    id: "cam_01",
    name: "Camera - 01",
    location: "Front Entrance",
    isOnline: true,
    isActive: false,
    timestamp: "03:12:37"
  },
  {
    id: "cam_02", 
    name: "Camera - 02",
    location: "Main Hall",
    isOnline: true,
    isActive: true,
    timestamp: "03:12:37"
  },
  {
    id: "cam_03",
    name: "Camera - 03", 
    location: "Parking Lot",
    isOnline: true,
    isActive: false,
    timestamp: "03:12:37"
  },
  {
    id: "cam_04",
    name: "Camera - 04",
    location: "Loading Dock",
    isOnline: false,
    isActive: false,
    timestamp: "03:12:37"
  }
];

export function VideoGrid() {
  const [selectedCamera, setSelectedCamera] = useState<string>("cam_02");

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      {mockCameraFeeds.map((camera) => (
        <div
          key={camera.id}
          className={cn(
            "relative bg-slate-800 rounded-lg overflow-hidden cursor-pointer transition-all duration-200",
            selectedCamera === camera.id && "ring-2 ring-primary",
            !camera.isOnline && "opacity-60"
          )}
          onClick={() => setSelectedCamera(camera.id)}
        >
          {/* Video Content Area */}
          <div className="aspect-video relative bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            {/* Live Video Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-slate-900"></div>
            
            {/* Featured Camera Content */}
            {selectedCamera === camera.id && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-6xl font-bold mb-4 tracking-wider text-white/90">
                    MANDATORY
                  </div>
                  <div className="text-lg text-white/70">
                    Active Monitoring Session
                  </div>
                </div>
              </div>
            )}
            
            {/* Regular Camera View */}
            {selectedCamera !== camera.id && (
              <div className="text-center text-white/60">
                <Camera className="h-12 w-12 mx-auto mb-2" />
                <p className="text-sm">{camera.name}</p>
              </div>
            )}

            {/* Status Indicator */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                camera.isOnline ? "bg-green-400" : "bg-red-400"
              )} />
              <span className="text-xs text-white/80">
                {camera.isOnline ? "LIVE" : "OFFLINE"}
              </span>
            </div>

            {/* Timestamp */}
            <div className="absolute top-3 right-3">
              <span className="text-xs text-white/80 bg-black/30 px-2 py-1 rounded">
                {camera.timestamp}
              </span>
            </div>

            {/* Recording Indicator */}
            {camera.isOnline && (
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <Circle className="w-2 h-2 fill-red-500 text-red-500 animate-pulse" />
                <span className="text-xs text-white/80">REC</span>
              </div>
            )}

            {/* Controls */}
            <div className="absolute bottom-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 w-8 h-8 p-0">
                <Play className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 w-8 h-8 p-0">
                <Volume2 className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 w-8 h-8 p-0">
                <Maximize2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Camera Info */}
          <div className="p-3 bg-card">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-foreground">{camera.name}</h4>
                <p className="text-xs text-muted-foreground">{camera.location}</p>
              </div>
              <Badge 
                variant={camera.isOnline ? "default" : "destructive"}
                className="text-xs"
              >
                {camera.isOnline ? "Online" : "Offline"}
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

'use client'
import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Incident, Camera as CameraType } from "@/shared/api/index";

interface MandatoryIncidentPlayerProps {
  selectedIncident: Incident | null;
  cameras: CameraType[];
}

export function MandatoryIncidentPlayer({ selectedIncident, cameras }: MandatoryIncidentPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([80]);
  const [progress, setProgress] = useState([0]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeCameraId, setActiveCameraId] = useState<string | null>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  // Set active camera when incident changes
  useEffect(() => {
    if (selectedIncident) {
      setActiveCameraId(selectedIncident.cameraId);
    }
  }, [selectedIncident]);
  
  // Get other cameras (excluding the current active camera)
  const otherCameras = cameras.filter(cam => cam.id !== activeCameraId).slice(0, 2);

  // Get the currently active camera info
  const activeCamera = cameras.find(cam => cam.id === activeCameraId) || selectedIncident?.camera;

  const handleCameraSwitch = (camera: CameraType) => {
    setActiveCameraId(camera.id);
    // Reset video state when switching cameras
    setIsPlaying(false);
    setProgress([0]);
  };

  // Simulate video progress when playing
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev[0] + 1;
          return newProgress >= 100 ? [0] : [newProgress]; // Loop back to start
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDuration = (start: string, end: string | null) => {
    if (!end) return "Ongoing";
    const startTime = new Date(start);
    const endTime = new Date(end);
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationMin = Math.round(durationMs / (1000 * 60));
    return `${durationMin} min`;
  };

  const formatProgress = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!selectedIncident) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Incident Player</CardTitle>
        </CardHeader>
        <CardContent className="h-full flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No incident selected</p>
            <p className="text-sm">Select an incident from the list to view details</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Incident Player</CardTitle>
          <Badge variant={selectedIncident.resolved ? "default" : "destructive"}>
            {selectedIncident.resolved ? "Resolved" : "Active"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3 overflow-y-auto">
        {/* Main Video Frame */}
        <div ref={videoRef} className="relative bg-black rounded-lg aspect-video group">
          {/* Static video frame - using thumbnail as video stub */}
          <img
            src={selectedIncident.thumbnailUrl}
            alt="Incident footage"
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              // Fallback to placeholder if thumbnail fails to load
              e.currentTarget.src = '/placeholder.svg';
            }}
          />

          {/* Video overlay - only show when not playing or on hover */}
          <div className={`absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center transition-opacity ${
            isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
          }`}>
            <Button
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/20"
              onClick={handlePlayPause}
            >
              {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
            </Button>
          </div>

          {/* Video controls */}
          <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={handleMute}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={handleFullscreen}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Status indicators */}
          <div className="absolute top-4 left-4 space-y-1">
            <Badge variant="outline" className="bg-black/50 text-white border-white/20">
              {isPlaying ? "LIVE" : formatTime(selectedIncident.tsStart)}
            </Badge>
            <div className="text-xs text-white bg-black/50 px-2 py-1 rounded">
              {activeCamera?.name || selectedIncident.camera?.name}
            </div>
          </div>

          {/* Progress indicator */}
          {isPlaying && (
            <div className="absolute top-4 right-4">
              <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                {formatProgress(progress[0])}
              </Badge>
            </div>
          )}

          {/* Video progress bar */}
          <div className="absolute bottom-16 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 text-white text-xs">
              <span>{formatProgress(progress[0])}</span>
              <Slider
                value={progress}
                max={100}
                step={1}
                className="flex-1"
                onValueChange={setProgress}
              />
              <span>1:40</span>
            </div>
          </div>
        </div>

        {/* Camera Thumbnails Strip - Functional */}
        <div className="space-y-2 flex-shrink-0">
          <h4 className="text-sm font-medium text-foreground">Other Cameras</h4>
          <div className="flex gap-3">
            {otherCameras.slice(0, 2).map((camera) => (
              <button
                key={camera.id}
                className="w-20 flex-shrink-0 group hover:scale-105 transition-transform"
                onClick={() => handleCameraSwitch(camera)}
              >
                <div className="bg-slate-800 rounded aspect-video relative overflow-hidden h-12 border border-slate-600 group-hover:border-primary">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center group-hover:from-slate-600 group-hover:to-slate-800 transition-colors">
                    <Camera className="h-5 w-5 text-white/60 group-hover:text-white/80" />
                  </div>
                  {/* Live indicator */}
                  <div className="absolute top-1 right-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate text-center group-hover:text-foreground transition-colors">{camera.name}</p>
              </button>
            ))}
            {/* Show placeholder if less than 2 cameras */}
            {otherCameras.length < 2 && (
              <div className="w-20 flex-shrink-0 opacity-50">
                <div className="bg-slate-800 rounded aspect-video relative overflow-hidden h-12 border border-slate-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                    <Camera className="h-5 w-5 text-white/30" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-center">No Camera</p>
              </div>
            )}
          </div>
        </div>

        {/* Incident Details - Compact */}
        <div className="space-y-2 pt-2 border-t flex-shrink-0">
          <div>
            <h4 className="text-sm font-medium mb-1">Incident Details</h4>
            <p className="text-sm text-muted-foreground">Type: {selectedIncident.type}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="font-medium">Camera:</span>
              <p className="text-muted-foreground truncate">
                {activeCamera?.name}
                {activeCameraId !== selectedIncident.cameraId && (
                  <span className="text-primary ml-1">(Switched)</span>
                )}
              </p>
            </div>
            <div>
              <span className="font-medium">Duration:</span>
              <p className="text-muted-foreground">
                {getDuration(selectedIncident.tsStart, selectedIncident.tsEnd)}
              </p>
            </div>
            <div className="col-span-2">
              <span className="font-medium">Time:</span>
              <p className="text-muted-foreground">
                {formatTime(selectedIncident.tsStart)} on {formatDate(selectedIncident.tsStart)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

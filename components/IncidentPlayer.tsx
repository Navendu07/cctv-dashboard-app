import { useState, useEffect, AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, AlertTriangle, Eye, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Incident } from "@/shared/api/index";

interface IncidentPlayerProps {
  incident: Incident | null;
}

export function IncidentPlayer({ incident }: IncidentPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(120); // 2 minutes mock duration
  const [volume, setVolume] = useState([80]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(prev => Math.min(prev + 1, duration));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-accent text-accent-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-destructive text-destructive-foreground';
      case 'investigating': return 'bg-warning text-warning-foreground';
      case 'resolved': return 'bg-success text-success-foreground';
      case 'false_positive': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (!incident) {
    return (
      <Card className="h-full">
        <CardContent className="h-full flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No incident selected</p>
            <p className="text-sm">Select an incident from the list to view details</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Incident #{incident.id.split('_')[1]}
          </CardTitle>
          <div className="flex gap-2">
            <Badge className={getSeverityColor(incident.severity)}>
              {incident.severity.toUpperCase()}
            </Badge>
            <Badge className={getStatusColor(incident.status)}>
              {incident.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Video Player Area */}
        <div className="relative bg-black rounded-lg aspect-video flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg flex items-center justify-center">
            <div className="text-center text-white/80">
              <Play className="h-16 w-16 mx-auto mb-4" />
              <p className="text-lg font-medium">Video Feed</p>
              <p className="text-sm opacity-75">{incident.camera.name}</p>
            </div>
          </div>
          
          {/* Bounding Box Overlay */}
          {incident.boundingBox && (
            <div 
              className="absolute border-2 border-primary bg-primary/20"
              style={{
                left: `${(incident.boundingBox.x / 640) * 100}%`,
                top: `${(incident.boundingBox.y / 480) * 100}%`,
                width: `${(incident.boundingBox.width / 640) * 100}%`,
                height: `${(incident.boundingBox.height / 480) * 100}%`,
              }}
            />
          )}
          
          <Button 
            variant="ghost" 
            size="lg" 
            className="absolute top-4 right-4 text-white hover:bg-white/20"
          >
            <Maximize2 className="h-5 w-5" />
          </Button>
        </div>

        {/* Video Controls */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground w-12">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              className="flex-1"
              onValueChange={(value) => setCurrentTime(value[0])}
            />
            <span className="text-sm text-muted-foreground w-12">
              {formatTime(duration)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="sm">
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <Slider
                value={volume}
                max={100}
                step={1}
                className="w-20"
                onValueChange={setVolume}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Incident Details */}
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Incident Details</h4>
            <p className="text-sm text-muted-foreground">{incident.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Time:</span>
              </div>
              <p className="text-muted-foreground ml-6">
                <span>{new Date(incident.timestamp ?? incident.tsStart).toLocaleString()}</span>

              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Location:</span>
              </div>
              <p className="text-muted-foreground ml-6">{incident.camera.location}</p>
            </div>
          </div>

          <div>
            <h5 className="font-medium mb-2">AI Analysis</h5>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Confidence:</span>
                <span className="ml-2 text-muted-foreground">
                  {Math.round(incident.confidence * 100)}%
                </span>
              </div>
              {incident.aiAnalysis && (
                <>
                  <div>
                    <span className="font-medium">Objects Detected:</span>
                    <div className="flex gap-1 mt-1">
                      {incident.aiAnalysis.objectsDetected.map((obj: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined, idx: Key | null | undefined) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {obj}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Alert Reason:</span>
                    <p className="text-muted-foreground mt-1">
                      {incident.aiAnalysis.alertReason}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

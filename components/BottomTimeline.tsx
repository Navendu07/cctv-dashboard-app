import { useState } from "react";
import { Camera, Video, AlertTriangle, Shield, Eye, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  time: string;
  type: 'unauthorized_access' | 'gun_threat' | 'face_recognized' | 'traffic_congestion';
  description: string;
  camera: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const timelineEvents: TimelineEvent[] = [
  {
    id: "1",
    time: "20:05",
    type: "unauthorized_access",
    description: "Unauthorized Access",
    camera: "Camera - 01",
    severity: "high"
  },
  {
    id: "2", 
    time: "20:12",
    type: "gun_threat",
    description: "Gun Threat",
    camera: "Camera - 02",
    severity: "critical"
  },
  {
    id: "3",
    time: "20:18",
    type: "unauthorized_access", 
    description: "Unauthorized Access",
    camera: "Camera - 03",
    severity: "high"
  },
  {
    id: "4",
    time: "20:25",
    type: "face_recognized",
    description: "Face Recognized",
    camera: "Camera - 01",
    severity: "medium"
  },
  {
    id: "5",
    time: "20:32",
    type: "traffic_congestion",
    description: "Traffic congestion",
    camera: "Camera - 02",
    severity: "medium"
  },
  {
    id: "6",
    time: "20:38",
    type: "unauthorized_access",
    description: "Unauthorized Access", 
    camera: "Camera - 03",
    severity: "high"
  }
];

const cameraList = [
  { id: "cam_01", name: "Camera - 01", isSelected: true },
  { id: "cam_02", name: "Camera - 02", isSelected: false },
  { id: "cam_03", name: "Camera - 03", isSelected: false },
];

export function BottomTimeline() {
  const [selectedCamera, setSelectedCamera] = useState("cam_01");

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'unauthorized_access':
        return <AlertTriangle className="h-3 w-3 text-warning" />;
      case 'gun_threat':
        return <Shield className="h-3 w-3 text-destructive" />;
      case 'face_recognized':
        return <Eye className="h-3 w-3 text-primary" />;
      case 'traffic_congestion':
        return <Video className="h-3 w-3 text-accent" />;
      default:
        return <Camera className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive';
      case 'high': return 'bg-warning';
      case 'medium': return 'bg-primary';
      case 'low': return 'bg-muted';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="h-32 bg-card border-t border-border flex">
      {/* Camera List */}
      <div className="w-48 border-r border-border p-4">
        <h3 className="text-sm font-medium text-foreground mb-3">Camera List</h3>
        <div className="space-y-2">
          {cameraList.map((camera) => (
            <Button
              key={camera.id}
              variant={selectedCamera === camera.id ? "default" : "ghost"}
              size="sm"
              className={cn(
                "w-full justify-start text-xs h-8",
                selectedCamera === camera.id && "bg-primary text-primary-foreground"
              )}
              onClick={() => setSelectedCamera(camera.id)}
            >
              <Camera className="h-3 w-3 mr-2" />
              {camera.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 p-4">
        <div className="text-sm mb-3">
          Timeline Events
        </div>
        
        <ScrollArea className="h-16">
          <div className="flex gap-2">
            {timelineEvents.map((event, index) => (
              <div
                key={event.id}
                className="flex-shrink-0 w-32 p-2 bg-muted rounded border cursor-pointer hover:bg-muted/80 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-foreground">{event.time}</span>
                  <div className={cn("w-2 h-2 rounded-full", getSeverityColor(event.severity))} />
                </div>
                
                <div className="flex items-center gap-1 mb-1">
                  {getEventIcon(event.type)}
                  <span className="text-xs text-foreground truncate">{event.description}</span>
                </div>
                
                <div className="text-xs text-muted-foreground">{event.camera}</div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Clock, AlertTriangle, Camera, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Incident } from "@/shared/api/index";
import { cn } from "@/lib/utils";

interface IncidentTimelineProps {
  selectedIncident: Incident | null;
  onSelectIncident: (incident: Incident) => void;
}

export function IncidentTimeline({ selectedIncident, onSelectIncident }: IncidentTimelineProps) {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    // Fetch incidents for timeline
    const fetchIncidents = async () => {
      try {
        const response = await fetch('/api/incidents?limit=20');
        const data = await response.json();
        setIncidents(data.incidents);
      } catch (error) {
        console.error("Error fetching incidents for timeline:", error);
      }
    };
    
    fetchIncidents();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive';
      case 'high': return 'bg-warning';
      case 'medium': return 'bg-accent';
      case 'low': return 'bg-muted';
      default: return 'bg-muted';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getIncidentTypeLabel = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Group incidents by date
  const groupedIncidents = incidents.reduce((groups, incident) => {
    const date = new Date(incident.timestamp ?? incident.tsStart).toDateString();

    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(incident);
    return groups;
  }, {} as Record<string, Incident[]>);

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Incident Timeline
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-full">
          <div className="p-6 pt-0">
            {Object.entries(groupedIncidents).map(([date, dayIncidents]) => (
              <div key={date} className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px bg-border flex-1" />
                  <span className="text-sm font-medium text-muted-foreground px-2">
                    {formatDate(dayIncidents[0]?.timestamp ?? dayIncidents[0]?.tsStart)}

                  </span>
                  <div className="h-px bg-border flex-1" />
                </div>

                <div className="space-y-3">
                  {dayIncidents.map((incident, index) => (
                    <div
                      key={incident.id}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
                        selectedIncident?.id === incident.id && "bg-muted border border-primary"
                      )}
                      onClick={() => onSelectIncident(incident)}
                    >
                      {/* Timeline indicator */}
                      <div className="flex flex-col items-center mt-1">
                        <div className={cn(
                          "w-3 h-3 rounded-full",
                          getSeverityColor(incident.severity),
                          selectedIncident?.id === incident.id && "ring-2 ring-primary ring-offset-2"
                        )} />
                        {index < dayIncidents.length - 1 && (
                          <div className="w-px h-8 bg-border mt-2" />
                        )}
                      </div>

                      {/* Incident content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {getIncidentTypeLabel(incident.type)}
                            </span>
                            <Badge 
                              variant="outline" 
                              className={cn("text-xs", getSeverityColor(incident.severity))}
                            >
                              {incident.severity.toUpperCase()}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(incident.timestamp ?? incident.tsStart)}

                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                          {incident.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Camera className="h-3 w-3" />
                            <span>{incident.camera.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{incident.camera.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {incidents.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No incidents to display</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

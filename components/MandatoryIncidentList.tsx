'use client'
import { useState, useEffect } from "react";
import { AlertTriangle, Shield, Eye, Clock, CheckCircle, User, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Incident, IncidentsResponse, ResolveIncidentResponse } from "@/shared/api";
import { cn } from "@/lib/utils";

interface MandatoryIncidentListProps {
  selectedIncident: Incident | null;
  onSelectIncident: (incident: Incident) => void;
}

export function MandatoryIncidentList({ selectedIncident, onSelectIncident }: MandatoryIncidentListProps) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(false);
  const [resolvingIds, setResolvingIds] = useState<Set<string>>(new Set());
  const [resolvedCount, setResolvedCount] = useState(0);
  const [unresolvedCount, setUnresolvedCount] = useState(0);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      // Fetch unresolved incidents for the list
      const unresolvedResponse = await fetch('/api/incidents?resolved=false');
      const unresolvedData: IncidentsResponse = await unresolvedResponse.json();
      setIncidents(unresolvedData.incidents);
      setUnresolvedCount(unresolvedData.total);

      // Fetch resolved incidents count
      const resolvedResponse = await fetch('/api/incidents?resolved=true');
      const resolvedData: IncidentsResponse = await resolvedResponse.json();
      setResolvedCount(resolvedData.total);
    } catch (error) {
      console.error("Error fetching incidents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleResolve = async (incident: Incident) => {
    // Optimistic UI - immediately fade out the row
    setResolvingIds(prev => new Set(prev).add(incident.id));
    
    try {
      const response = await fetch(`/api/incidents/${incident.id}/resolve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to resolve incident');
      }

      const data: ResolveIncidentResponse = await response.json();
      
      // Remove from list if now resolved, or update if unresolved
      if (data.incident.resolved) {
        setIncidents(prev => prev.filter(inc => inc.id !== incident.id));
        setUnresolvedCount(prev => prev - 1);
        setResolvedCount(prev => prev + 1);
        // If this was the selected incident, clear selection
        if (selectedIncident?.id === incident.id) {
          onSelectIncident(incidents.find(inc => inc.id !== incident.id) || incidents[0]);
        }
      } else {
        // Update the incident in the list
        setIncidents(prev => prev.map(inc =>
          inc.id === incident.id ? data.incident : inc
        ));
        setUnresolvedCount(prev => prev + 1);
        setResolvedCount(prev => prev - 1);
      }
    } catch (error) {
      console.error("Error resolving incident:", error);
      // Revert optimistic UI on error
      setResolvingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(incident.id);
        return newSet;
      });
    }
  };

  const getIncidentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'gun threat':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'unauthorised access':
        return <Shield className="h-4 w-4 text-warning" />;
      case 'face recognised':
        return <User className="h-4 w-4 text-primary" />;
      default:
        return <Eye className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'gun threat':
        return 'text-destructive';
      case 'unauthorised access':
        return 'text-warning';
      case 'face recognised':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDuration = (start: string, end: string | null) => {
    if (!end) return "Ongoing";
    const startTime = new Date(start);
    const endTime = new Date(end);
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationMin = Math.round(durationMs / (1000 * 60));
    return `${durationMin}m`;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4 flex-shrink-0">
        <CardTitle className="flex items-center justify-between">
          <span>Incidents</span>
        </CardTitle>
        <div className="flex gap-2 mt-2">
          <Badge variant="destructive" className="text-xs">
            {unresolvedCount} Unresolved
          </Badge>
          <Badge variant="default" className="text-xs">
            {resolvedCount} Resolved
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-2 p-6 pt-0">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2 animate-spin" />
                <p>Loading incidents...</p>
              </div>
            ) : incidents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No unresolved incidents</p>
                <p className="text-xs">All incidents have been resolved</p>
              </div>
            ) : (
              incidents.map((incident) => (
                <div
                  key={incident.id}
                  className={cn(
                    "p-4 rounded-lg border cursor-pointer transition-all duration-300",
                    selectedIncident?.id === incident.id && "bg-muted border-primary",
                    resolvingIds.has(incident.id) && "opacity-50 scale-95",
                    "hover:bg-muted/50"
                  )}
                  onClick={() => onSelectIncident(incident)}
                >
                  <div className="flex items-start gap-3">
                    {/* Thumbnail */}
                    <div className="w-12 h-12 bg-slate-800 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={incident.thumbnailUrl} 
                        alt="Incident thumbnail"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getIncidentIcon(incident.type)}
                          <span className={cn("text-sm font-medium", getTypeColor(incident.type))}>
                            {incident.type}
                          </span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs h-6 px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResolve(incident);
                          }}
                          disabled={resolvingIds.has(incident.id)}
                        >
                          {resolvingIds.has(incident.id) ? "Resolving..." : "Resolve"}
                        </Button>
                      </div>

                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{incident.camera?.location}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {formatTime(incident.tsStart)} - {incident.tsEnd ? formatTime(incident.tsEnd) : "Ongoing"}
                            </span>
                          </div>
                          <span className="font-medium">
                            {getDuration(incident.tsStart, incident.tsEnd)}
                          </span>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          {formatDate(incident.tsStart)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

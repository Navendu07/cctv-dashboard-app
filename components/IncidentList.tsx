import { useState, useEffect } from "react";
import { Filter, RefreshCw, AlertTriangle, Clock, MapPin, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Incident, IncidentsResponse } from "@/shared/api/index";
import { cn } from "@/lib/utils";

interface IncidentListProps {
  selectedIncident: Incident | null;
  onSelectIncident: (incident: Incident) => void;
}

export function IncidentList({ selectedIncident, onSelectIncident }: IncidentListProps) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (severityFilter !== "all") params.append("severity", severityFilter);
      
      const response = await fetch(`/api/incidents?${params}`);
      const data: IncidentsResponse = await response.json();
      setIncidents(data.incidents);
    } catch (error) {
      console.error("Error fetching incidents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [statusFilter, severityFilter]);

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

  const getIncidentTypeLabel = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const incidentTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - incidentTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Incidents ({incidents.length})
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchIncidents} 
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="investigating">Investigating</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="false_positive">False Positive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full">
          <div className="space-y-2 p-6 pt-0">
            {incidents.map((incident) => (
              <div
                key={incident.id}
                className={cn(
                  "p-4 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50",
                  selectedIncident?.id === incident.id && "bg-muted border-primary"
                )}
                onClick={() => onSelectIncident(incident)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(incident.severity)} variant="secondary">
                      {incident.severity.toUpperCase()}
                    </Badge>
                    <Badge className={getStatusColor(incident.status)} variant="outline">
                      {incident.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(incident.timestamp?? incident.tsStart)}
                  </span>
                </div>

                <h4 className="font-medium text-sm mb-1">
                  {getIncidentTypeLabel(incident.type)}
                </h4>
                
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {incident.description}
                </p>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Camera className="h-3 w-3" />
                    <span>{incident.camera.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(incident.timestamp ?? incident.tsStart).toLocaleTimeString()}</span>

                  </div>
                </div>

                {incident.aiAnalysis && (
                  <div className="mt-2 pt-2 border-t">
                    <div className="flex items-center gap-1 text-xs">
                      <span className="font-medium">Confidence:</span>
                      <span className="text-muted-foreground">
                        {Math.round(incident.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {incidents.length === 0 && !loading && (
              <div className="text-center py-8 text-muted-foreground">
                <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No incidents found</p>
                <p className="text-xs">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

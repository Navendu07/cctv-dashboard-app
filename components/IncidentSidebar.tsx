import { useState, useEffect } from "react";
import { AlertTriangle, Shield, Eye, Clock, ChevronRight, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Incident, IncidentsResponse } from "@shared/api";
import { cn } from "@/lib/utils";

export function IncidentSidebar() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [activeIncidents, setActiveIncidents] = useState(0);
  const [resolvedIncidents, setResolvedIncidents] = useState(0);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await fetch('/api/incidents?limit=10');
        const data: IncidentsResponse = await response.json();
        setIncidents(data.incidents);
        
        const active = data.incidents.filter(inc => inc.status === 'active').length;
        const resolved = data.incidents.filter(inc => inc.status === 'resolved').length;
        setActiveIncidents(active);
        setResolvedIncidents(resolved);
      } catch (error) {
        console.error("Error fetching incidents:", error);
      }
    };
    
    fetchIncidents();
  }, []);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'high':
        return <Shield className="h-4 w-4 text-warning" />;
      default:
        return <Eye className="h-4 w-4 text-primary" />;
    }
  };

  const getIncidentTypeLabel = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
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

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Circle className="w-2 h-2 fill-destructive text-destructive" />
          <span className="text-lg font-semibold text-destructive">
            {activeIncidents + resolvedIncidents} Unresolved Incidents
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Circle className="w-1.5 h-1.5 fill-destructive text-destructive" />
            <span className="text-muted-foreground">{activeIncidents} resolved incidents</span>
          </div>
        </div>
      </div>

      {/* Incidents List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {incidents.map((incident) => (
            <div
              key={incident.id}
              className="group p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getSeverityIcon(incident.severity)}
                  <span className="text-sm font-medium text-foreground">
                    {getIncidentTypeLabel(incident.type)}
                  </span>
                </div>
                <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80 p-0 h-auto">
                  Resolve
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>

              <div className="text-xs text-muted-foreground mb-2">
                <div className="flex items-center gap-1 mb-1">
                  <span>West Face Camera A</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(incident.timestamp)} on {formatDate(incident.timestamp)}</span>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                {incident.description}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

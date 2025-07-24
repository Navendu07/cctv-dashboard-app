import { Shield, Bell, Settings, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export function Navbar() {
  return (
    <nav className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      {/* Logo and Brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">SecureSight</span>
        </div>
        <Badge variant="outline" className="text-xs text-muted-foreground">
          v2.1.0
        </Badge>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search incidents, cameras, or locations..." 
            className="pl-10"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
          >
            3
          </Badge>
        </Button>
        
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
        
        <div className="ml-2 flex items-center gap-2">
          <div className="text-right text-sm">
            <div className="font-medium text-foreground">John Smith</div>
            <div className="text-xs text-muted-foreground">Security Admin</div>
          </div>
          <Button variant="ghost" size="sm" className="rounded-full">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}

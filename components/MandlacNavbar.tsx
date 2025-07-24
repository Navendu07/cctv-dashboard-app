'use client'

import { Grid3X3, Camera, Shield, AlertTriangle, Users, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function MandlacNavbar() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="w-6 h-6 bg-blue-500 rounded-sm flex items-center justify-center">
          <Grid3X3 className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-semibold text-white tracking-wider">MANDLAC-X</span>
      </Link>

      {/* Navigation Menu */}
      <div className="flex items-center gap-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className={isActive("/") ? "text-yellow-400 font-medium" : "text-slate-300 hover:text-white"}
          asChild
        >
          <Link href="/">
            <Grid3X3 className="h-4 w-4 mr-2" />
            Dashboard
          </Link>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className={isActive("/cameras") ? "text-yellow-400 font-medium" : "text-slate-300 hover:text-white"}
          asChild
        >
          <Link href="/cameras">
            <Camera className="h-4 w-4 mr-2" />
            Cameras
          </Link>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={isActive("/scenes") ? "text-yellow-400 font-medium" : "text-slate-300 hover:text-white"}
          asChild
        >
          <Link href="/scenes">
            <Shield className="h-4 w-4 mr-2" />
            Scenes
          </Link>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={isActive("/incidents") ? "text-yellow-400 font-medium" : "text-slate-300 hover:text-white"}
          asChild
        >
          <Link href="/incidents">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Incidents
          </Link>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={isActive("/users") ? "text-yellow-400 font-medium" : "text-slate-300 hover:text-white"}
          asChild
        >
          <Link href="/users">
            <Users className="h-4 w-4 mr-2" />
            Users
          </Link>
        </Button>
      </div>

      {/* User Profile */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-3 hover:bg-slate-700">
            <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">MA</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-white">Mohammad Alhafi</div>
              <div className="text-xs text-slate-300">alhafi@mandlac.com</div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}

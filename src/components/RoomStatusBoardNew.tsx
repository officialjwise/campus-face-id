import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Building, 
  Users, 
  RefreshCw, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Activity
} from "lucide-react";
import { useRoomStatus, useRecognitionLogs } from "@/hooks/useRooms";
import type { RoomStatus } from "@/types/api";

const RoomStatusBoardNew = () => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Queries with auto-refresh
  const { data: roomStatuses, isLoading, error, refetch } = useRoomStatus();
  const { data: recentLogs } = useRecognitionLogs({ limit: 10 });

  // Update timestamp when data refreshes
  useEffect(() => {
    if (roomStatuses) {
      setLastUpdated(new Date());
    }
  }, [roomStatuses]);

  const getStatusBadge = (status: RoomStatus['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-600">Active</Badge>;
      case 'full':
        return <Badge variant="destructive">Full</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 95) return 'text-red-600 bg-red-50';
    if (percentage >= 80) return 'text-yellow-600 bg-yellow-50';
    if (percentage >= 60) return 'text-blue-600 bg-blue-50';
    return 'text-green-600 bg-green-50';
  };

  const getTotalStats = () => {
    if (!roomStatuses) return { totalRooms: 0, totalCapacity: 0, totalAssigned: 0, activeRooms: 0 };
    
    return roomStatuses.reduce(
      (acc, room) => ({
        totalRooms: acc.totalRooms + 1,
        totalCapacity: acc.totalCapacity + room.capacity,
        totalAssigned: acc.totalAssigned + room.assigned_students_count,
        activeRooms: acc.activeRooms + (room.status === 'active' ? 1 : 0),
      }),
      { totalRooms: 0, totalCapacity: 0, totalAssigned: 0, activeRooms: 0 }
    );
  };

  const stats = getTotalStats();
  const overallUtilization = stats.totalCapacity > 0 ? (stats.totalAssigned / stats.totalCapacity) * 100 : 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Room Status Board</h1>
            <p className="text-muted-foreground">Real-time exam room monitoring dashboard</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="shadow-elegant">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive font-medium">Failed to load room status</p>
          <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
          <Button onClick={() => refetch()} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Room Status Board</h1>
          <p className="text-muted-foreground">Real-time exam room monitoring dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-elegant">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Rooms</p>
                <p className="text-2xl font-bold text-primary">{stats.totalRooms}</p>
              </div>
              <Building className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Rooms</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeRooms}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalAssigned.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Utilization</p>
                <p className="text-2xl font-bold text-purple-600">{Math.round(overallUtilization)}%</p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
            <Progress value={overallUtilization} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Room Status Grid */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            Room Status Overview
          </CardTitle>
          <CardDescription>
            Real-time status of all examination rooms
          </CardDescription>
        </CardHeader>
        <CardContent>
          {roomStatuses && roomStatuses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roomStatuses.map((room) => {
                const utilizationPercentage = (room.assigned_students_count / room.capacity) * 100;
                
                return (
                  <Card key={room.room_code} className="border-2">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{room.room_code}</CardTitle>
                          <CardDescription className="text-sm">
                            {room.room_name}
                          </CardDescription>
                        </div>
                        {getStatusBadge(room.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Capacity Info */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Assigned:</span>
                        <span className="font-medium">
                          {room.assigned_students_count}/{room.capacity}
                        </span>
                      </div>

                      {/* Utilization Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Utilization</span>
                          <span className={`font-medium px-2 py-1 rounded-full ${getUtilizationColor(utilizationPercentage)}`}>
                            {Math.round(utilizationPercentage)}%
                          </span>
                        </div>
                        <Progress 
                          value={utilizationPercentage} 
                          className="h-2"
                        />
                      </div>

                      {/* Index Range */}
                      <div className="text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Index Range:</span>
                          <span className="font-mono">
                            {room.index_start.toLocaleString()} - {room.index_end.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Validation Stats */}
                      {(room.validation_count || room.rejection_count) && (
                        <div className="flex justify-between text-xs pt-2 border-t">
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>{room.validation_count || 0} valid</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3 text-red-500" />
                            <span>{room.rejection_count || 0} rejected</span>
                          </div>
                        </div>
                      )}

                      {/* Last Activity */}
                      {room.last_activity && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
                          <Clock className="h-3 w-3" />
                          <span>Last activity: {new Date(room.last_activity).toLocaleTimeString()}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No room assignments found</p>
              <p className="text-sm text-muted-foreground">Create room assignments to see status information</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {recentLogs && recentLogs.items && recentLogs.items.length > 0 && (
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Validation Activity
            </CardTitle>
            <CardDescription>
              Latest student validation attempts across all rooms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {recentLogs.items.map((log) => (
                <div 
                  key={log.id}
                  className={`p-3 rounded-lg border ${
                    log.validation_status === 'valid' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {log.validation_status === 'valid' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm font-medium">
                        {log.student?.first_name} {log.student?.last_name || 'Unknown Student'}
                      </span>
                      {log.index_number && (
                        <Badge variant="outline" className="text-xs font-mono">
                          {log.index_number}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {log.room_code}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={log.validation_status === 'valid' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {log.validation_status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  {log.message && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {log.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RoomStatusBoardNew;

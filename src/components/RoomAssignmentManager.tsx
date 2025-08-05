import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Building, 
  Users, 
  Loader2, 
  Eye,
  Search,
  RefreshCw,
  CheckCircle
} from "lucide-react";
import { 
  useRoomAssignments, 
  useCreateRoomAssignment, 
  useUpdateRoomAssignment, 
  useDeleteRoomAssignment,
  useRoomPreview,
  useRoomAssignment
} from "@/hooks/useRooms";
import type { RoomAssignment, CreateRoomAssignmentRequest } from "@/types/api";

const RoomAssignmentManager = () => {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<RoomAssignment | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [viewingRoomId, setViewingRoomId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<CreateRoomAssignmentRequest>({
    room_code: '',
    room_name: '',
    index_start: '',
    index_end: '',
    capacity: 0,
    description: '',
  });

  // Queries and mutations
  const { data: assignments, isLoading, error, refetch } = useRoomAssignments();
  const createMutation = useCreateRoomAssignment();
  const updateMutation = useUpdateRoomAssignment();
  const deleteMutation = useDeleteRoomAssignment();
  
  // Preview query - only enabled when we want to preview
  const { data: previewData, isLoading: isPreviewLoading, refetch: refetchPreview } = useRoomPreview(
    {
      index_start: formData.index_start,
      index_end: formData.index_end,
    },
    showPreview
  );

  // Room details query for viewing students
  const { data: roomDetails } = useRoomAssignment(viewingRoomId || '');

  // Validation functions
  const checkIndexRangeOverlap = (startIndex: string | number, endIndex: string | number, excludeId?: string) => {
    if (!assignments?.items) return false;
    
    const start = typeof startIndex === 'string' ? parseInt(startIndex) : startIndex;
    const end = typeof endIndex === 'string' ? parseInt(endIndex) : endIndex;
    
    return assignments.items.some(assignment => {
      // Skip the assignment being edited
      if (excludeId && assignment.id === excludeId) return false;
      
      // Check for any overlap between the ranges
      return (
        (start >= assignment.index_start && start <= assignment.index_end) ||
        (end >= assignment.index_start && end <= assignment.index_end) ||
        (start <= assignment.index_start && end >= assignment.index_end)
      );
    });
  };

  const getOverlappingAssignments = (startIndex: string | number, endIndex: string | number, excludeId?: string) => {
    if (!assignments?.items) return [];
    
    const start = typeof startIndex === 'string' ? parseInt(startIndex) : startIndex;
    const end = typeof endIndex === 'string' ? parseInt(endIndex) : endIndex;
    
    return assignments.items.filter(assignment => {
      // Skip the assignment being edited
      if (excludeId && assignment.id === excludeId) return false;
      
      // Check for any overlap between the ranges
      return (
        (start >= assignment.index_start && start <= assignment.index_end) ||
        (end >= assignment.index_start && end <= assignment.index_end) ||
        (start <= assignment.index_start && end >= assignment.index_end)
      );
    });
  };

  const handlePreview = async () => {
    if (!formData.index_start || !formData.index_end) {
      toast({
        title: "Missing Information",
        description: "Please enter both start and end index numbers.",
        variant: "destructive",
      });
      return;
    }

    const start = parseInt(formData.index_start.toString());
    const end = parseInt(formData.index_end.toString());

    if (start >= end) {
      toast({
        title: "Invalid Range",
        description: "End index must be greater than start index.",
        variant: "destructive",
      });
      return;
    }

    setShowPreview(true);
    await refetchPreview();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const start = parseInt(formData.index_start.toString());
    const end = parseInt(formData.index_end.toString());
    
    if (start >= end) {
      toast({
        title: "Invalid Range",
        description: "End index must be greater than start index.",
        variant: "destructive",
      });
      return;
    }

    // Check for index range overlaps
    const excludeId = editingAssignment?.id;
    const hasOverlap = checkIndexRangeOverlap(start, end, excludeId);
    
    if (hasOverlap) {
      const overlappingAssignments = getOverlappingAssignments(start, end, excludeId);
      const overlappingRooms = overlappingAssignments.map(a => a.room_code).join(', ');
      
      toast({
        title: "Index Range Overlap",
        description: `The index range ${start}-${end} overlaps with existing assignments: ${overlappingRooms}`,
        variant: "destructive",
      });
      return;
    }

    try {
      const submissionData = {
        ...formData,
        index_start: start,
        index_end: end,
      };
      
      if (editingAssignment) {
        await updateMutation.mutateAsync({
          id: editingAssignment.id,
          data: submissionData
        });
        toast({
          title: "Room Assignment Updated",
          description: `Successfully updated assignment for room ${formData.room_code}`,
        });
        setEditingAssignment(null);
      } else {
        await createMutation.mutateAsync(submissionData);
        toast({
          title: "Room Assignment Created",
          description: `Successfully created assignment for room ${formData.room_code}`,
        });
        setIsCreateDialogOpen(false);
      }
      
      // Reset form
      resetForm();
      setShowPreview(false);
    } catch (error: any) {
      console.error('Save failed with error:', error);
      toast({
        title: "Failed to Save Assignment",
        description: error.message || "An error occurred while saving the room assignment.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (assignment: RoomAssignment) => {
    setEditingAssignment(assignment);
    setFormData({
      room_code: assignment.room_code,
      room_name: assignment.room_name,
      index_start: assignment.index_start.toString(),
      index_end: assignment.index_end.toString(),
      capacity: assignment.capacity,
      description: assignment.description || '',
    });
  };

  const handleDelete = async (assignmentId: string, roomCode: string) => {
    try {
      await deleteMutation.mutateAsync(assignmentId);
      toast({
        title: "Room Assignment Deleted",
        description: `Successfully deleted assignment for room ${roomCode}`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to Delete Assignment",
        description: error.message || "An error occurred while deleting the room assignment.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      room_code: '',
      room_name: '',
      index_start: '',
      index_end: '',
      capacity: 0,
      description: '',
    });
    setEditingAssignment(null);
    setShowPreview(false);
  };

  const getUtilizationColor = (assigned: number, capacity: number) => {
    const percentage = (assigned / capacity) * 100;
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStatusBadge = (assigned: number, capacity: number) => {
    const percentage = (assigned / capacity) * 100;
    if (percentage >= 100) return <Badge variant="destructive">Full</Badge>;
    if (percentage >= 90) return <Badge variant="secondary">Near Full</Badge>;
    return <Badge variant="default">Available</Badge>;
  };

  // Filter assignments based on search term
  const filteredAssignments = assignments?.items?.filter(assignment =>
    assignment.room_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.room_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading room assignments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="shadow-elegant">
        <CardContent className="p-6 text-center">
          <p className="text-destructive">Failed to load room assignments</p>
          <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Room Assignment Manager</h1>
          <p className="text-muted-foreground">Manage index number ranges for exam rooms</p>
        </div>

        <Dialog open={isCreateDialogOpen || !!editingAssignment} onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Room Assignment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingAssignment ? 'Edit Room Assignment' : 'Create Room Assignment'}
              </DialogTitle>
              <DialogDescription>
                {editingAssignment 
                  ? 'Update the room assignment details below.' 
                  : 'Define the index number range for a specific exam room.'
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="room_code">Room Code</Label>
                  <Input
                    id="room_code"
                    placeholder="e.g., ROOM_A1"
                    value={formData.room_code}
                    onChange={(e) => setFormData(prev => ({ ...prev, room_code: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="room_name">Room Name</Label>
                  <Input
                    id="room_name"
                    placeholder="e.g., Main Auditorium"
                    value={formData.room_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, room_name: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="index_start">Start Index</Label>
                  <Input
                    id="index_start"
                    type="number"
                    placeholder="20100001"
                    value={formData.index_start || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, index_start: parseInt(e.target.value) || 0 }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="index_end">End Index</Label>
                  <Input
                    id="index_end"
                    type="number"
                    placeholder="20100050"
                    value={formData.index_end || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, index_end: parseInt(e.target.value) || 0 }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Room Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="50"
                    value={formData.capacity || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                    required
                  />
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Range:</strong> {formData.index_start} - {formData.index_end} 
                  {formData.index_end && formData.index_start && parseInt(formData.index_end.toString()) > parseInt(formData.index_start.toString()) && (
                    <span className="ml-2 text-primary">
                      ({parseInt(formData.index_end.toString()) - parseInt(formData.index_start.toString()) + 1} students)
                    </span>
                  )}
                  {formData.capacity > 0 && (
                    <span className="ml-4 text-info">
                      <strong>Capacity:</strong> {formData.capacity} seats
                    </span>
                  )}
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Assignments Table */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            Room Assignments
          </CardTitle>
          <CardDescription>
            Current room assignments with index ranges
          </CardDescription>
        </CardHeader>
        <CardContent>
          {assignments?.items?.length === 0 ? (
            <div className="text-center py-8">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground">No Room Assignments</h3>
              <p className="text-muted-foreground">Create your first room assignment to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room Code</TableHead>
                    <TableHead>Room Name</TableHead>
                    <TableHead>Index Range</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments?.items?.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {assignment.room_code}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{assignment.room_name}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono">
                          {assignment.index_start} - {assignment.index_end}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{assignment.capacity}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-primary font-medium">
                          {assignment.index_end - assignment.index_start + 1}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(assignment.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(assignment)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Room Assignment</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the assignment for room "{assignment.room_code}"? 
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(assignment.id, assignment.room_code)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RoomAssignmentManager;

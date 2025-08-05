import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  User,
  Building,
  Hash,
  Loader2,
  Shield
} from "lucide-react";
import { useRoomAssignments, useQuickValidation } from "@/hooks/useRooms";
import type { QuickValidationResponse } from "@/types/api";

const QuickIndexValidator = () => {
  const { toast } = useToast();
  
  // Component state
  const [indexNumber, setIndexNumber] = useState('');
  const [selectedRoomCode, setSelectedRoomCode] = useState('');
  const [validationResult, setValidationResult] = useState<QuickValidationResponse | null>(null);
  const [validationHistory, setValidationHistory] = useState<QuickValidationResponse[]>([]);

  // Queries and mutations
  const { data: rooms } = useRoomAssignments();
  const quickValidation = useQuickValidation();

  const handleValidation = async () => {
    if (!indexNumber.trim()) {
      toast({
        title: "Index Number Required",
        description: "Please enter a student index number.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedRoomCode) {
      toast({
        title: "Room Required",
        description: "Please select a room to validate against.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await quickValidation.mutateAsync({
        roomCode: selectedRoomCode,
        indexNumber: indexNumber.trim(),
      });

      setValidationResult(response);
      
      // Add to history (keep last 10)
      setValidationHistory(prev => [response, ...prev.slice(0, 9)]);

      // Show toast based on result
      if (response.valid) {
        toast({
          title: "✅ Valid Assignment",
          description: response.message,
          duration: 3000,
        });
      } else {
        toast({
          title: "⚠️ Invalid Assignment",
          description: response.message,
          variant: "destructive",
          duration: 5000,
        });
      }

    } catch (error: any) {
      console.error('Quick validation failed:', error);
      toast({
        title: "Validation Failed",
        description: error.message || "Failed to validate index number. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleValidation();
    }
  };

  const clearResults = () => {
    setValidationResult(null);
    setIndexNumber('');
  };

  const getResultStatusIcon = (result: QuickValidationResponse) => {
    if (result.valid) {
      return <CheckCircle className="h-8 w-8 text-green-500" />;
    } else {
      return <XCircle className="h-8 w-8 text-red-500" />;
    }
  };

  const getResultStatusColor = (result: QuickValidationResponse) => {
    if (result.valid) {
      return 'bg-green-50 border-green-200';
    } else {
      return 'bg-red-50 border-red-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quick Index Validator</h1>
          <p className="text-muted-foreground">Quickly validate student room assignments by index number</p>
        </div>
        {validationResult && (
          <Button
            variant="outline"
            onClick={clearResults}
          >
            Clear Results
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Validation Form */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Index Validation
            </CardTitle>
            <CardDescription>
              Enter student index number and select room to validate assignment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Room Selection */}
            <div className="space-y-2">
              <Label htmlFor="room-select">Select Room *</Label>
              <Select value={selectedRoomCode} onValueChange={setSelectedRoomCode}>
                <SelectTrigger id="room-select">
                  <SelectValue placeholder="Choose room..." />
                </SelectTrigger>
                <SelectContent>
                  {rooms?.items?.map((room) => (
                    <SelectItem key={room.id} value={room.room_code}>
                      <div className="flex items-center justify-between w-full">
                        <span>{room.room_code} - {room.room_name}</span>
                        <Badge variant="outline" className="ml-2">
                          {room.index_start.toLocaleString()} - {room.index_end.toLocaleString()}
                        </Badge>
                      </div>
                    </SelectItem>
                  )) || []}
                </SelectContent>
              </Select>
            </div>

            {/* Index Number Input */}
            <div className="space-y-2">
              <Label htmlFor="index-number">Student Index Number *</Label>
              <Input
                id="index-number"
                type="text"
                placeholder="e.g., 8551650"
                value={indexNumber}
                onChange={(e) => setIndexNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                className="font-mono"
              />
            </div>

            {/* Validate Button */}
            <Button 
              onClick={handleValidation}
              disabled={quickValidation.isPending || !indexNumber.trim() || !selectedRoomCode}
              className="w-full"
            >
              {quickValidation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Validating...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Validate Assignment
                </>
              )}
            </Button>

            {/* Room Info */}
            {selectedRoomCode && rooms?.items && (
              <div className="bg-muted/50 p-3 rounded-lg">
                {(() => {
                  const selectedRoom = rooms.items.find(room => room.room_code === selectedRoomCode);
                  return selectedRoom ? (
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">Room:</span>
                        <span>{selectedRoom.room_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Valid Range:</span>
                        <span>{selectedRoom.index_start.toLocaleString()} - {selectedRoom.index_end.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Total Students:</span>
                        <span>{selectedRoom.assigned_students_count || 0}</span>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Validation Results */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Validation Result
            </CardTitle>
            <CardDescription>
              Assignment validation status and details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {quickValidation.isPending ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Validating assignment...</p>
                </div>
              </div>
            ) : validationResult ? (
              <div className={`p-4 rounded-lg border-2 ${getResultStatusColor(validationResult)}`}>
                <div className="flex items-start gap-3">
                  {getResultStatusIcon(validationResult)}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">
                        {validationResult.valid ? 'Valid Assignment' : 'Invalid Assignment'}
                      </h3>
                      <Badge 
                        variant={validationResult.valid ? 'default' : 'destructive'}
                      >
                        {validationResult.valid ? 'Valid' : 'Invalid'}
                      </Badge>
                    </div>
                    
                    <p className="text-sm font-medium">
                      {validationResult.message}
                    </p>

                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Index Number:</span>
                        <span className="font-mono font-medium">{validationResult.index_number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Room Code:</span>
                        <span className="font-medium">{validationResult.room_code}</span>
                      </div>
                      
                      {validationResult.student && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Student Name:</span>
                            <span className="font-medium">
                              {validationResult.student.first_name} {validationResult.student.last_name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Email:</span>
                            <span className="font-medium">{validationResult.student.email}</span>
                          </div>
                          {validationResult.student.college && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">College:</span>
                              <span className="font-medium">{validationResult.student.college.name}</span>
                            </div>
                          )}
                        </>
                      )}

                      {validationResult.room_assignment && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Assigned Room:</span>
                            <span className="font-medium">{validationResult.room_assignment.room_name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Valid Range:</span>
                            <span className="font-mono text-xs">
                              {validationResult.room_assignment.index_start.toLocaleString()} - {validationResult.room_assignment.index_end.toLocaleString()}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-center">
                <div>
                  <Hash className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No validation performed yet</p>
                  <p className="text-sm text-muted-foreground">
                    Enter an index number and select a room to validate assignment
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Validation History */}
      {validationHistory.length > 0 && (
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Recent Validations
            </CardTitle>
            <CardDescription>
              History of recent validation checks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {validationHistory.map((result, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border ${
                    result.valid 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {result.valid ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="font-mono text-sm font-medium">
                        {result.index_number}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {result.room_code}
                      </Badge>
                      {result.student && (
                        <span className="text-sm">
                          - {result.student.first_name} {result.student.last_name}
                        </span>
                      )}
                    </div>
                    <Badge 
                      variant={result.valid ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {result.valid ? 'Valid' : 'Invalid'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {result.message}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuickIndexValidator;

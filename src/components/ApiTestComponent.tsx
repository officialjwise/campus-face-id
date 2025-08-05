import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { roomApi } from "@/services/roomApi";

const ApiTestComponent = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const testFetchRooms = async () => {
    setLoading(true);
    try {
      console.log('Testing room fetch...');
      const result = await roomApi.getAll();
      console.log('Room fetch result:', result);
      setResults(result);
      toast({
        title: "Success",
        description: `Fetched rooms successfully. Found ${result.items?.length || (Array.isArray(result) ? result.length : 0)} rooms.`,
      });
    } catch (error) {
      console.error('Room fetch failed:', error);
      setResults({ error: (error as Error).message });
      toast({
        title: "Fetch Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testCreateRoom = async () => {
    setLoading(true);
    try {
      console.log('Testing room creation...');
      const testData = {
        room_code: 'TEST-001',
        room_name: 'Test Room 001',
        index_start: 1000,
        index_end: 1010,
        capacity: 10,
      };
      console.log('Creating room with data:', testData);
      const result = await roomApi.create(testData);
      console.log('Room creation result:', result);
      setResults(result);
      toast({
        title: "Success",
        description: `Room created successfully: ${result.room_code}`,
      });
    } catch (error) {
      console.error('Room creation failed:', error);
      setResults({ error: (error as Error).message });
      toast({
        title: "Creation Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>API Test Component</CardTitle>
          <CardDescription>Test room API endpoints</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={testFetchRooms} disabled={loading}>
              Test Fetch Rooms
            </Button>
            <Button onClick={testCreateRoom} disabled={loading}>
              Test Create Room
            </Button>
          </div>
          
          {results && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Results:</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiTestComponent;

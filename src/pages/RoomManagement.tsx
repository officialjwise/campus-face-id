import RoomAssignmentManager from "@/components/RoomAssignmentManager";

const RoomManagement = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Room Management</h1>
        <p className="text-muted-foreground">
          Manage exam room assignments, preview capacity, and monitor utilization
        </p>
      </div>
      <RoomAssignmentManager />
    </div>
  );
};

export default RoomManagement;

import RoomStatusBoardNew from "@/components/RoomStatusBoardNew";

const RoomStatus = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Room Status Board</h1>
          <p className="text-muted-foreground">
            Live monitoring of exam room utilization and validation activity
          </p>
        </div>
        <RoomStatusBoardNew />
      </div>
    </div>
  );
};

export default RoomStatus;

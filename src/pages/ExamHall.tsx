import FaceRecognitionValidator from "@/components/FaceRecognitionValidator";

const ExamHall = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Exam Hall Validation</h1>
          <p className="text-muted-foreground">
            Real-time face recognition validation for exam room assignments
          </p>
        </div>
        <FaceRecognitionValidator />
      </div>
    </div>
  );
};

export default ExamHall;

import QuickIndexValidator from "@/components/QuickIndexValidator";

const IndexLookup = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Quick Index Lookup</h1>
          <p className="text-muted-foreground">
            Validate student index numbers against room assignments
          </p>
        </div>
        <QuickIndexValidator />
      </div>
    </div>
  );
};

export default IndexLookup;

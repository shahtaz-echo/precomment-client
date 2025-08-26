import { BookOpen } from "lucide-react";
import React from "react";

const NoDataFound = () => {
  return (
    <div className="text-center h-[60vh] center flex-col">
      <BookOpen
        className="mx-auto h-12 w-12 text-muted-foreground mb-4"
        strokeWidth={1.5}
      />
      <h3 className="text-lg font-medium mb-2">No FAQ Links found</h3>
      {/* <p className="text-muted-foreground mb-4">
        {search
          ? "Try adjusting your search criteria"
          : "Create your first FAQ link to get started"}
      </p>
      {search && (
        <Button variant="outline" onClick={() => setSearch("")}>
          Clear Search
        </Button>
      )} */}
    </div>
  );
};

export default NoDataFound;

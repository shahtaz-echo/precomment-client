import React, { useCallback } from "react";
import { Button } from "./ui/button";

const Pagination = ({ total, PAGE_SIZE, page, setPage }) => {
  const handlePageChange = useCallback((newPage) => {
    setPage(Math.max(1, newPage));
  }, []);

  if (total <= PAGE_SIZE) return null;
  else
    return (
      <div className="flx justify-center items-center space-x-4 mt-8">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
          className="tr"
        >
          Previous
        </Button>
        <div className="flx items-center space-x-2">
          {Array.from({ length: Math.ceil(total / PAGE_SIZE) }, (_, i) => i + 1)
            .filter((pageNum) => {
              const totalPages = Math.ceil(total / PAGE_SIZE);
              return (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= page - 1 && pageNum <= page + 1)
              );
            })
            .map((pageNum, index, array) => (
              <React.Fragment key={pageNum}>
                {index > 0 && array[index - 1] !== pageNum - 1 && (
                  <span className="text-muted-foreground">...</span>
                )}
                <Button
                  variant={page === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                  className="tr"
                >
                  {pageNum}
                </Button>
              </React.Fragment>
            ))}
        </div>
        <Button
          variant="outline"
          disabled={page * PAGE_SIZE >= total}
          onClick={() => handlePageChange(page + 1)}
          className="tr"
        >
          Next
        </Button>
      </div>
    );
};

export default Pagination;

import { useFaqLinkListQuery } from "@/features/faqs/faqApiSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useState, useCallback, useMemo } from "react";

import { BookOpen, Plus, Search } from "lucide-react";

import FAQCard from "./faq-card";
import CreateFAQLinkDialog from "./create-faq-link";
import VectorSearchDrawer from "./faq-drawer";
import Pagination from "@/components/pagination";

const FAQLinks = ({ tenant_id }) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [faqPages, setFaqPages] = useState({});
  const [faqSearches, setFaqSearches] = useState({});

  const PAGE_SIZE = 10;

  // Memoize query parameters to prevent unnecessary re-renders
  const linkQueryParams = useMemo(
    () => ({
      tenant_id,
      page,
      page_size: PAGE_SIZE,
      search,
    }),
    [tenant_id, page, search]
  );

  // Fetch FAQ links
  const {
    data: faqLinksData,
    isLoading: isLinksLoading,
    isError: isLinksError,
    refetch: refetchLinks,
  } = useFaqLinkListQuery(linkQueryParams, {
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: false,
  });

  const faqLinks = faqLinksData?.data || [];
  const meta = faqLinksData?.meta || {};

  // Callbacks to prevent unnecessary re-renders
  const toggleExpand = useCallback((id) => {
    setExpanded((current) => {
      if (current === id) {
        // Reset FAQ search when closing
        setFaqSearches((prev) => ({ ...prev, [id]: "" }));
        return null; // collapse
      } else {
        // Reset FAQ page and search when expanding new card
        setFaqPages((prev) => ({ ...prev, [id]: 1 }));
        setFaqSearches((prev) => ({ ...prev, [id]: "" }));
        return id; // expand new
      }
    });
  }, []);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearch(value);
    setPage(1); // Reset to first page when searching
    // Collapse expanded cards when main search changes
    setExpanded(null);
  }, []);

  const handleFaqSearchChange = useCallback((faqLinkId, value) => {
    setFaqSearches((prev) => ({ ...prev, [faqLinkId]: value }));
    setFaqPages((prev) => ({ ...prev, [faqLinkId]: 1 })); // Reset page when searching FAQs
  }, []);

  const handleFaqPageChange = useCallback((faqLinkId, newPage) => {
    setFaqPages((prev) => ({
      ...prev,
      [faqLinkId]: Math.max(1, newPage),
    }));
  }, []);

  // Loading component
  const LoadingState = () => (
    <div className="space-y-6">
      <div className="flx justify-between items-center">
        <h2 className="text-2xl font-bold">FAQ Links</h2>
        <CreateFAQLinkDialog />
      </div>
      <div className="flx items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Loading FAQ Links...</span>
      </div>
    </div>
  );

  // Error component
  const ErrorState = () => (
    <div className="space-y-6">
      <div className="flx justify-between items-center">
        <h2 className="text-2xl font-bold">FAQ Links</h2>
        <CreateFAQLinkDialog />
      </div>
      <div className="text-center py-8">
        <p className="text-red-500 mb-2">Failed to load FAQ Links.</p>
        <Button variant="outline" onClick={refetchLinks}>
          Try Again
        </Button>
      </div>
    </div>
  );

  // Render loading state
  if (isLinksLoading) {
    return <LoadingState />;
  }

  // Render error state
  if (isLinksError) {
    return <ErrorState />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flx justify-between items-center">
        <h2 className="text-2xl font-bold">FAQ Links</h2>
        <CreateFAQLinkDialog />
      </div>

      {/* Search */}
      <div className="flbx gap-2">
        <div className="flx w-full max-w-sm relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={16}
          />
          <Input
            placeholder="Search FAQ Links..."
            value={search}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
        <VectorSearchDrawer />
      </div>

      {/* Empty state */}
      {faqLinks.length === 0 && (
        <div className="text-center h-[60vh] center flex-col">
          <BookOpen
            className="mx-auto h-12 w-12 text-muted-foreground mb-4"
            strokeWidth={1.5}
          />
          <h3 className="text-lg font-medium mb-2">No FAQ Links found</h3>
          <p className="text-muted-foreground mb-4">
            {search
              ? "Try adjusting your search criteria"
              : "Create your first FAQ link to get started"}
          </p>
          {search && (
            <Button variant="outline" onClick={() => setSearch("")}>
              Clear Search
            </Button>
          )}
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 gap-6">
        {faqLinks.map((faqLink) => (
          <FAQCard
            key={faqLink.id}
            faqLink={faqLink}
            isExpanded={expanded === faqLink.id}
            currentPage={faqPages[faqLink.id] || 1}
            faqSearch={faqSearches[faqLink.id] || ""}
            pageSize={PAGE_SIZE}
            onToggleExpand={toggleExpand}
            onFaqPageChange={handleFaqPageChange}
            onFaqSearchChange={handleFaqSearchChange}
          />
        ))}
      </div>

      <Pagination
        total={meta.total_items}
        PAGE_SIZE={PAGE_SIZE}
        page={page}
        setPage={setPage}
      />
    </div>
  );
};

export default FAQLinks;

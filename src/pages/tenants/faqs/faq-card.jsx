import {
  useDeleteFAQLinkMutation,
  useFaqListQuery,
} from "@/features/faqs/faqApiSlice";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useCallback, useMemo, useRef, useState } from "react";
import moment from "moment";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Dot,
  ExternalLink,
  Search,
  Trash2,
  X,
} from "lucide-react";
import DeleteDialog from "@/components/dialog/delete-dialog";
import toast from "react-hot-toast";

const FAQCard = React.memo(
  ({
    faqLink,
    isExpanded,
    currentPage,
    faqSearch,
    pageSize,
    onToggleExpand,
    onFaqPageChange,
    onFaqSearchChange,
  }) => {
    const searchInputRef = useRef(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Memoize FAQ query parameters
    const faqQueryParams = useMemo(
      () => ({
        faq_link_id: faqLink.id,
        page: currentPage,
        page_size: pageSize,
        search: faqSearch,
      }),
      [faqLink.id, currentPage, pageSize, faqSearch]
    );

    // Fetch FAQs only when expanded
    const {
      data: faqsData,
      isLoading: isFaqsLoading,
      isError: isFaqsError,
    } = useFaqListQuery(faqQueryParams, {
      skip: !isExpanded,
    });

    const faqs = faqsData?.data || [];
    const faqMeta = faqsData?.meta || {};

    const handleToggleExpand = useCallback(() => {
      onToggleExpand(faqLink.id);
      // Focus on search input when expanding
      if (!isExpanded) {
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 100);
      }
    }, [onToggleExpand, faqLink.id, isExpanded]);

    const [deleteFAQ] = useDeleteFAQLinkMutation();

    const handleDelete = useCallback(async () => {
      const res = await deleteFAQ({ faq_link_id: faqLink.id });
      if (res.data.success) {
        toast.success(res.data.message || "FAQ link deleted");
      } else {
        toast.error(res.error?.data?.message || "Failed to delete FAQ link");
      }
    }, [faqLink.id]);

    const handleFaqSearchChange = useCallback(
      (e) => {
        onFaqSearchChange(faqLink.id, e.target.value);
      },
      [onFaqSearchChange, faqLink.id]
    );

    const clearFaqSearch = useCallback(() => {
      onFaqSearchChange(faqLink.id, "");
    }, [onFaqSearchChange, faqLink.id]);

    return (
      <Card
        className={`rounded-2xl shadow-sm tr ${
          !faqLink.is_active ? "opacity-60" : "hover:shadow-md"
        }`}
      >
        <CardHeader className="-mb-2">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-lg mb-1">{faqLink.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Created {moment(faqLink.created_at).format("DD MMM YYYY")}
              </p>
            </div>
            <div>
              {!faqLink.is_active ? (
                <div className="flx text-xs font-semibold text-gray-600">
                  <Dot />
                  Inactive
                </div>
              ) : (
                 <div className="flx text-xs font-semibold text-green-500">
                  <Dot />
                  Active
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-sm mb-4 text-muted-foreground">
            {faqLink.description || "No description provided."}
          </p>

          <div className="flbx">
            <button
              onClick={handleToggleExpand}
              className="flx items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 tr"
            >
              {isExpanded ? (
                <>
                  <ChevronUp size={16} />
                  Hide FAQs
                </>
              ) : (
                <>
                  <ChevronDown size={16} />
                  Show FAQs
                </>
              )}
            </button>
            <div className="flx gap-2 text-xs">
              <a
                href={faqLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flx gap-1 bg-green-100 py-2 px-3 rounded-full font-medium text-green-900 hover:bg-green-600 hover:text-white tr"
              >
                <ExternalLink size={12} />
                Visit Link
              </a>
              <DeleteDialog
                onConfirm={() => handleDelete(faqLink.id)}
                trigger={
                  <button className="flx gap-1 bg-red-100 py-2 px-3 rounded-full font-medium text-red-700 hover:bg-red-500 hover:text-white tr">
                    <Trash2 size={12} />
                    Delete
                  </button>
                }
                title="Delete FAQ Link"
                description="This will permanently remove the item."
                open={deleteDialogOpen}
                setOpen={setDeleteDialogOpen}
              />
            </div>
          </div>

          {/* Expanded FAQs */}
          {isExpanded && (
            <div className="mt-6 border-t pt-6 space-y-4">
              {/* FAQ Search Bar */}
              <div className="flx w-full relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  size={14}
                />
                <Input
                  ref={searchInputRef}
                  placeholder="Search FAQs within this link..."
                  value={faqSearch}
                  onChange={handleFaqSearchChange}
                  className="pl-9 pr-10"
                />
                {faqSearch && (
                  <button
                    onClick={clearFaqSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground tr"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* FAQ Content */}
              {isFaqsLoading && (
                <div className="flx items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                  <span className="ml-2 text-sm text-muted-foreground">
                    Loading FAQs...
                  </span>
                </div>
              )}

              {isFaqsError && (
                <div className="text-center py-6">
                  <p className="text-red-500 text-sm">Failed to load FAQs.</p>
                </div>
              )}

              {!isFaqsLoading && faqs.length === 0 && (
                <div className="text-center py-8">
                  <BookOpen className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground text-sm">
                    {faqSearch
                      ? "No FAQs match your search"
                      : "No FAQs found for this link"}
                  </p>
                  {faqSearch && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFaqSearch}
                      className="mt-2 tr"
                    >
                      Clear Search
                    </Button>
                  )}
                </div>
              )}

              {faqs.map((faq, index) => (
                <div
                  key={faq.id}
                  className="p-4 rounded-lg bg-muted/30 border hover:bg-muted/50 tr"
                >
                  <div className="flex items-start gap-3">
                    <div className="center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex-shrink-0">
                      {(currentPage - 1) * pageSize + index + 1}
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <h3>{faq.question}</h3>
                      <p>{faq.answer || "No answer provided."}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Inner Pagination */}
              {faqMeta.total_items > pageSize && (
                <div className="flx justify-center items-center space-x-4 mt-6 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => onFaqPageChange(faqLink.id, currentPage - 1)}
                    className="tr"
                  >
                    Previous
                  </Button>
                  <span className="flx items-center px-3 text-xs text-muted-foreground">
                    Page {currentPage} of{" "}
                    {Math.ceil(faqMeta.total_items / pageSize)}
                    <span className="ml-2 text-muted-foreground/70">
                      ({faqMeta.total_items} total)
                    </span>
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage * pageSize >= faqMeta.total_items}
                    onClick={() => onFaqPageChange(faqLink.id, currentPage + 1)}
                    className="tr"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);

export default FAQCard;

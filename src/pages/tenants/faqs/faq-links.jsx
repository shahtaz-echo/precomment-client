import { useFaqLinkListQuery } from "@/features/faqs/faqApiSlice";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import moment from "moment";
import { BookOpen, ExternalLink, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router";
import DeleteDialog from "@/components/dialog/delete-dialog";

const FAQLinks = ({ tenant_id }) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const PAGE_SIZE = 10;

  const { data, isLoading, isError } = useFaqLinkListQuery(
    { tenant_id, page, page_size: PAGE_SIZE, search },
    { refetchOnReconnect: true, refetchOnMountOrArgChange: false }
  );

  const faqLinks = data?.data || [];
  const meta = data?.meta || {};

  const handleDelete = (id) => {
    console.log("Item deleted!");
  };

  // maintain individual open state per card
  const [openStates, setOpenStates] = useState({});

  const toggleDialog = (id, value) => {
    setOpenStates((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flbx">
        <h2>Faq Links</h2>
        <Button>
          <Plus size={14} />
          <span className="pr-1">Faq Link</span>
        </Button>
      </div>
      <div className="flex w-full max-w-sm">
        <Input
          placeholder="Search FAQs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* FAQ Cards */}
      <div className="grid grid-cols-1 gap-6">
        {isLoading && <p>Loading FAQs...</p>}
        {isError && <p className="text-red-500">Failed to load FAQs.</p>}

        {!isLoading && faqLinks.length === 0 && (
          <p className="col-span-full text-muted-foreground">No FAQs found.</p>
        )}

        {faqLinks.map((faq) => (
          <Card
            key={faq.id}
            className={`rounded-2xl shadow-sm ${faq.is_active ? "opacity-60" : ""}`}
          >
            <CardHeader>
              <CardTitle className="text-lg">{faq.name}</CardTitle>
              <p>Created at {moment(faq.created_at).format("DD MMM YYYY")}</p>
            </CardHeader>
            <CardContent>
              <p>{faq.description || "No description provided."}</p>

              <div className="flbx mt-4 justify-between items-center">
                <div className="flx gap-6">
                  <Link
                    href={`/faqs/${faq.id}`}
                    className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    <BookOpen size={16} />
                    See FAQs
                  </Link>
                  <a
                    href={faq.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    <ExternalLink size={16} />
                    Visit Link
                  </a>
                </div>

                <DeleteDialog
                  onConfirm={() => handleDelete(faq.id)}
                  trigger={
                    <button className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                      <Trash2 size={16} />
                      Delete Link
                    </button>
                  }
                  title="Delete FAQ Link"
                  description="This will permanently remove the item."
                  open={openStates[faq.id] || false}
                  setOpen={(value) => toggleDialog(faq.id, value)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {meta.total_items > PAGE_SIZE && (
        <div className="flex justify-center space-x-4 mt-4">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={page * PAGE_SIZE >= meta.total_items}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default FAQLinks;

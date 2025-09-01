import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useParams } from "react-router";
import { useSearchProductsMutation } from "@/features/products/productApiSlice";

const ProductVectorSearchDrawer = () => {
  const { tenant_id } = useParams();
  const [userQuery, setUserQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searchFAQs, { isLoading }] = useSearchProductsMutation();

  const handleSearch = async () => {
    if (!userQuery.trim()) return;
    try {
      const res = await searchFAQs({
        tenant_id,
        user_query: userQuery,
      }).unwrap();
      setResults(res?.data || []);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Search size={14} />
          <span className="mr-1">Vector Search</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="lg:max-w-xl">
        <SheetHeader className="px-8">
          <SheetTitle>Search Products</SheetTitle>
          <SheetDescription>
            Enter your query below to search Products using vector search
          </SheetDescription>
        </SheetHeader>

        <div className="py-4 w-full px-8 flx gap-2">
          <Input
            placeholder="Type your query..."
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1"
          />
          <Button
            onClick={handleSearch}
            disabled={isLoading}
            className="w-24 mr-3"
          >
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </div>

        <div className="space-y-3 max-h-fit overflow-y-auto px-8 pb-8">
          {results.length === 0 && !isLoading && (
            <p className="text-muted-foreground text-sm">No results found.</p>
          )}
          {results.map((faq) => (
            <div
              key={faq.id}
              className="p-3 rounded-lg border bg-muted/30 space-y-2"
            >
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProductVectorSearchDrawer;

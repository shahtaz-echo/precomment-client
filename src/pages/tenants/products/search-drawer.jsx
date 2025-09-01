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
import { Link, useParams } from "react-router";
import { useSearchProductsMutation } from "@/features/products/productApiSlice";
import { imgMinified } from "@/lib/minified";

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
          <div className="grid grid-cols-2 gap-4">
            {results.map((product, idx) => (
              <ProductCard key={idx} product={product} />
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProductVectorSearchDrawer;

const ProductCard = ({ product }) => {
  return (
    <Link
      to={product?.url}
      className="p-4 rounded-xl border bg-muted/30 space-y-3 shadow-sm hover:shadow-md transition"
    >
      {/* Image */}
      {product.image_url ? (
        <img
          src={imgMinified(product.image_url)}
          alt={product.name}
          className="w-full h-48 object-cover rounded-lg"
        />
      ) : (
        <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-lg text-gray-400">
          No image
        </div>
      )}

      {/* Product Info */}
      <div className="space-y-1">
        <h5 className="text-xs py-1 px-2 bg-blue-100 text-blue-500 w-fit rounded-full mb-2">
          {product.category}
        </h5>
        <h4>{product.name}</h4>
        <p className="line-clamp-2">{product.description}</p>
      </div>

      {/* Reranking */}
      <div className="flex justify-between items-center">
        <span className="text-base font-bold">
          {product.relevance_score.toFixed(4)}
        </span>
      </div>
    </Link>
  );
};

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useState, useCallback, useMemo, useEffect } from "react";

import { BookOpen, Dot, Search } from "lucide-react";

import { useProductListQuery } from "@/features/products/productApiSlice";
import { useParams } from "react-router";
import ProductCard from "./product-card";
import Pagination from "@/components/pagination";
import ProductVectorSearchDrawer from "./search-drawer";

// Custom debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const ProductList = () => {
  const { tenant_id } = useParams();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // Debounce search input to prevent excessive API calls
  const debouncedSearch = useDebounce(search, 500); // 500ms delay

  const PAGE_SIZE = 64;

  // Memoize query parameters to prevent unnecessary re-renders
  const linkQueryParams = useMemo(
    () => ({
      tenant_id,
      page,
      page_size: PAGE_SIZE,
      search: debouncedSearch, // Use debounced search value
    }),
    [tenant_id, page, debouncedSearch] // Updated dependency
  );

  // Fetch products with better error handling
  const {
    data: productData,
    isLoading: isProductsLoading,
    isError: isProductsError,
    error: productsError,
    refetch: refetchProducts,
  } = useProductListQuery(linkQueryParams, {
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: false,
    // Add skip condition for invalid tenant_id
    skip: !tenant_id,
  });

  // Safe data extraction with fallbacks
  const products = productData?.data || [];
  const meta = productData?.meta || { total_items: 0 };

  // Reset page when search changes
  useEffect(() => {
    if (debouncedSearch !== search) {
      setPage(1);
    }
  }, [debouncedSearch, search]);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearch(value);
    // Page reset is now handled in useEffect
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearch("");
    setPage(1);
  }, []);

  const handleRetry = useCallback(() => {
    refetchProducts();
  }, [refetchProducts]);

  // Loading component with better styling
  const LoadingState = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Loading Products...</span>
      </div>
    </div>
  );

  // Enhanced error component with error details
  const ErrorState = () => (
    <div className="text-center py-8">
      <p className="text-red-500 mb-2">
        Failed to load Products.
        {productsError?.data?.message && (
          <span className="block text-sm mt-1">
            {productsError.data.message}
          </span>
        )}
      </p>
      <Button variant="outline" onClick={handleRetry}>
        Try Again
      </Button>
    </div>
  );

  // Show loading state
  if (isProductsLoading) {
    return <LoadingState />;
  }

  // Show error state
  if (isProductsError) {
    return <ErrorState />;
  }

  // Handle missing tenant_id
  if (!tenant_id) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Invalid tenant ID</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="flbx">
        <div className="flex items-center gap-2">
          <div className="flex w-full max-w-sm relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <Input
              placeholder="Search Products"
              value={search}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
          {search && (
            <Button variant="outline" size="sm" onClick={handleClearSearch}>
              Clear
            </Button>
          )}
        </div>
        <ProductVectorSearchDrawer />
      </div>

      {/* Show search indicator when debouncing */}
      {search !== debouncedSearch && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
          <span>Searching...</span>
        </div>
      )}

      {/* metadata */}
      <div className="text-sm text-muted-foreground flx">
        <p>{meta?.total_items} Products found</p>
        <Dot />
        <p>
          Showing page {page} of {meta?.total_pages}
        </p>
      </div>

      {/* Empty state */}
      {products.length === 0 && (
        <div className="text-center py-16">
          <BookOpen
            className="mx-auto h-12 w-12 text-muted-foreground mb-4"
            strokeWidth={1.5}
          />
          <h3 className="text-lg font-medium mb-2">No Products found</h3>
          <p className="text-muted-foreground mb-4">
            {debouncedSearch
              ? "Try adjusting your search criteria"
              : "Create your first Product to get started"}
          </p>
          {debouncedSearch && (
            <Button variant="outline" onClick={handleClearSearch}>
              Clear Search
            </Button>
          )}
        </div>
      )}

      {/* Products Grid */}
      {products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} data={product} />
          ))}
        </div>
      )}

      {/* Pagination - only show if there are products and pagination is needed */}
      {products.length > 0 && meta.total_items > PAGE_SIZE && (
        <Pagination
          total={meta.total_items}
          PAGE_SIZE={PAGE_SIZE}
          page={page}
          setPage={setPage}
        />
      )}
    </div>
  );
};

export default ProductList;

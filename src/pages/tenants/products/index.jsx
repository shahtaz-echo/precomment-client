import React from "react";
import CreateProductDialog from "./create-products";
import FetchProductDialog from "./fetch-products";

const TenantProductPage = () => {
  return (
    <div>
      {/* Header */}
      <div className="flx justify-between items-center">
        <h2 className="text-2xl font-bold">Products</h2>
        <div className="flx gap-2">
          <CreateProductDialog />
          <FetchProductDialog />
        </div>
      </div>
    </div>
  );
};

export default TenantProductPage;

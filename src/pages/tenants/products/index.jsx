import React, { useState } from "react";
import FetchProductDialog from "./fetch-products";

import ProductList from "./product-list";
import DeleteDialog from "@/components/dialog/delete-dialog";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useDeleteProductMutation } from "@/features/products/productApiSlice";
import { useParams } from "react-router";

const TenantProductPage = () => {
  const { tenant_id } = useParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [deleteProduct, { isLoading }] = useDeleteProductMutation();

  const handleDelete = async () => {
    const res = await deleteProduct({ tenant_id });
    if (res?.success) {
      setDeleteDialogOpen(false);
      toast.success(res?.message || "Products deleted successfully");
    } else {
      toast.error(res?.message || "Failed to delete products");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flx justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Products</h2>
        <div className="flx gap-2">
          <FetchProductDialog />
          <DeleteDialog
            onConfirm={handleDelete}
            isLoading={isLoading}
            trigger={
              <button className="flx gap-2 bg-red-100 py-2 pl-3 pr-4 text-sm rounded-md font-medium text-red-700 hover:bg-red-500 hover:text-white tr">
                <Trash2 size={12} />
                Delete Feed
              </button>
            }
            title="Delete All products"
            description="This will permanently remove all the products."
            open={deleteDialogOpen}
            setOpen={setDeleteDialogOpen}
          />
        </div>
      </div>
      <ProductList />
    </div>
  );
};

export default TenantProductPage;

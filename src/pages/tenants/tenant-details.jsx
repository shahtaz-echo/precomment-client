import React, { useState } from "react";
import {
  useDeleteTenantMutation,
  useTenantDetailsQuery,
} from "@/features/tenants/tenantApiSlice";
import moment from "moment";
import { Blocks, Book, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router";
import DeleteDialog from "@/components/dialog/delete-dialog";
import toast from "react-hot-toast";
import UpdateTenantDialog from "./tenant-update";

const TenantDetails = ({ tenant_id }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Hooks must always be declared at the top level
  const { data, isLoading, isError } = useTenantDetailsQuery(
    { tenant_id },
    {
      skip: !tenant_id,
      refetchOnReconnect: true,
      refetchOnMountOrArgChange: false,
    }
  );
  const [deleteTenant, { isLoading: deleteLoading }] =
    useDeleteTenantMutation();

  const tenant = data?.data || {};

  const handleDelete = async (id) => {
    try {
      const res = await deleteTenant({ tenant_id: id }).unwrap(); // unwrap gives direct success/error
      toast.success("Client Deleted Successfully");
      setDeleteDialogOpen(false);
      navigate("/");
    } catch (err) {
      toast.error("Failed to Delete Client");
    }
  };

  if (isLoading) {
    return <p className="p-4">Loading tenant details...</p>;
  }

  if (isError) {
    return <p className="p-4 text-red-500">Failed to load tenant details.</p>;
  }

  return (
    <div className="max-w-sm pr-8 sticky top-16 w-full border-r h-[80vh] pb-2 flex flex-col justify-between">
      <div>
        <Link to="/" className="flx gap-2">
          <img src="/public/favicon.svg" className="h-8 w-8 object-contain" />
          <h5 className="text-xl font-bold text-blue-500">Chatbot Dev</h5>
        </Link>

        <h2 className="capitalize mt-12">{tenant.store_name}</h2>
        <p>{tenant.store_type || "Not specified"}</p>

        <div className="space-y-6 mt-8">
          <div>
            <p className="font-medium flx gap-2 mb-1.5">
              <Clock size={14} />
              Created At
            </p>
            <p>
              {tenant.created_at
                ? moment(tenant.created_at).format("DD MMM YYYY")
                : "Unknown"}
            </p>
          </div>

          <div>
            <p className="font-medium flx gap-2 mb-1.5">
              <Blocks size={14} />
              Index Id
            </p>
            <p>{tenant.index_id || "No index id found"}</p>
          </div>

          <div>
            <p className="font-medium flx gap-2 mb-1.5">
              <Book size={14} />
              Description
            </p>
            <p>{tenant.description || "No description provided."}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 font-medium text-sm">
        <UpdateTenantDialog data={tenant} />
        <DeleteDialog
          onConfirm={() => handleDelete(tenant?.tenant_id)}
          trigger={
            <button
              className="py-2 w-24 bg-red-100 rounded-full text-red-500"
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </button>
          }
          title="Delete Client"
          description="This will permanently remove the client and all the associated data."
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
        />
      </div>
    </div>
  );
};

export default TenantDetails;

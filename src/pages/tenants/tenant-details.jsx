import { useTenantDetailsQuery } from "@/features/tenants/tenantApiSlice";
import React from "react";
import moment from "moment";
import { ArrowLeft, Book, Clock } from "lucide-react";
import { Link } from "react-router";

const TenantDetails = ({ tenant_id }) => {
  const { data, isLoading, isError } = useTenantDetailsQuery(
    { tenant_id },
    {
      skip: !tenant_id, // don’t fetch if tenant_id is missing
      refetchOnReconnect: true,
      refetchOnMountOrArgChange: false, // don’t refetch if cached
    }
  );

  const tenant = data?.data || {};

  if (isLoading) return <p className="p-4">Loading tenant details...</p>;
  if (isError)
    return <p className="p-4 text-red-500">Failed to load tenant details.</p>;

  return (
    <div className="max-w-sm w-full border-r min-h-80">
      <Link to="/" className="absolute -ml-16 mt-1 border p-1 rounded-full">
        <ArrowLeft />
      </Link>
      <h2 className="capitalize">{tenant.store_name}</h2>
      <p>{tenant.type || "Not specified"}</p>

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
            <Book size={14} />
            Description
          </p>
          <p>{tenant.description || "No description provided."}</p>
        </div>
      </div>
    </div>
  );
};

export default TenantDetails;

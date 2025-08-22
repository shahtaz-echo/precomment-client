import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTenantListQuery } from "@/features/tenants/tenantApiSlice";
import { ArrowRight, Clock, Plus } from "lucide-react";
import moment from "moment";
import PageContainer from "@/components/container/page-container";

const Homepage = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const PAGE_SIZE = 10;

  const { data, isLoading, isError } = useTenantListQuery(
    { page, page_size: PAGE_SIZE, search },
    { refetchOnReconnect: true }
  );

  const tenants = data?.data || [];
  const meta = data?.meta || {};

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Existing Clients</h2>
        <Button>
          <Plus size={14} />
          <span className="pr-1">New Client</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex w-full max-w-sm">
        <Input
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tenant List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && <p>Loading tenants...</p>}
        {isError && <p className="text-red-500">Failed to load tenants.</p>}

        {!isLoading && tenants.length === 0 && (
          <p className="col-span-full text-muted-foreground">
            No clients found.
          </p>
        )}

        {tenants.map((tenant) => (
          <Card key={tenant.tenant_id} className="rounded-2xl shadow-sm">
            <CardHeader>
              <div className="flbx">
                <div className="space-y-1">
                  <CardTitle className="capitalize">
                    {tenant.store_name}
                  </CardTitle>
                  <p>Clothing Store</p>
                </div>
                <Link
                  to={`/tenants/${tenant?.tenant_id}`}
                  className="border rounded-full p-2"
                >
                  <ArrowRight className="-rotate-45" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground ">
                Placeholder description for {tenant.store_name}
              </p>
              <p className="flx gap-2 mt-4 text-xs text-gray-500">
                <Clock size={14} />
                Created at {moment(tenant.created_at).format("DD MMM YYYY")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {meta?.total_items > PAGE_SIZE && (
        <div className="flex justify-center space-x-4 mt-8">
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
    </PageContainer>
  );
};

export default Homepage;

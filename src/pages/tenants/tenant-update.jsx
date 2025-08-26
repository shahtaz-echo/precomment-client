import * as React from "react";
import { useParams } from "react-router";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { useUpdateTenantMutation } from "@/features/tenants/tenantApiSlice";

const UpdateTenantDialog = ({ data }) => {
  const { tenant_id } = useParams();
  const [open, setOpen] = React.useState(false);

  // Keep original data to compare and show
  const [originalData, setOriginalData] = React.useState({
    store_name: data?.store_name || "",
    description: data?.description || "",
    store_url: data?.store_url || "",
    store_type: data?.store_type || "",
  });

  const [form, setForm] = React.useState({ ...originalData });

  const [updateTenant, { isLoading }] = useUpdateTenantMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      // Only include fields that are different from original
      const payload = Object.fromEntries(
        Object.entries(form).filter(([key, value]) => value !== originalData[key])
      );

      if (Object.keys(payload).length === 0) {
        toast.error("No changes detected.");
        return;
      }

      const res = await updateTenant({ tenant_id, payload }).unwrap();

      if (res?.success) {
        toast.success(res.message || "Client updated successfully.");
        setOpen(false);
        setOriginalData({ ...form }); // update originalData to latest
      } else {
        toast.error(res?.message || "Failed to update Client.");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update Client.");
      console.error("Failed to update Client:", err);
    }
  };

  // When the dialog opens, initialize form with original data
  React.useEffect(() => {
    if (open) {
      setForm({ ...originalData });
    }
  }, [open, originalData]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="py-2 w-24 bg-blue-100 rounded-full text-blue-500">
          Update
        </button>
      </DialogTrigger>

      <DialogContent className="lg:max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>Update Client</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="store_name">Name</Label>
              <Input
                id="store_name"
                name="store_name"
                value={form.store_name}
                onChange={handleChange}
                placeholder="Enter client name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="store_type">Store Type</Label>
              <Input
                id="store_type"
                name="store_type"
                value={form.store_type}
                onChange={handleChange}
                placeholder="Ex. Clothing Store"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="store_url">URL</Label>
            <Input
              id="store_url"
              name="store_url"
              value={form.store_url}
              onChange={handleChange}
              placeholder="https://example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add a description..."
              rows={5}
              className="min-h-24"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            className="bg-primary text-white hover:bg-primary/90"
            onClick={handleUpdate}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTenantDialog;

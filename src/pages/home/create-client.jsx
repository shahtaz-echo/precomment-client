import * as React from "react";
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
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useCreateTenantMutation } from "@/features/tenants/tenantApiSlice";

const CreateClientDialog = () => {
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    store_name: "",
    description: "",
    store_url: "",
    store_type: "",
  });

  const [createTenant, { isLoading }] = useCreateTenantMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    try {
      const res = await createTenant(form).unwrap();

      if (res?.success) {
        toast.success(res.message || "Client created successfully.");
        setForm({ store_name: "", url: "", store_type: "", description: "" });
        setOpen(false);
      } else {
        toast.error(res?.message || "Failed to create Client.");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create Client.");
      console.error("Failed to create Client:", err);
    }
  };

  React.useEffect(() => {
    if (open) {
      setForm({ store_name: "", store_url: "", store_type: "", description: "" });
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus size={14} />
          <span className="mr-1">New Client</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="lg:max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>Create New Client</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
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
            onClick={handleCreate}
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClientDialog;

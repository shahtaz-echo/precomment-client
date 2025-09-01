import * as React from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router";

// components
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
import { Label } from "@/components/ui/label";

// icons
import { Download, Rocket } from "lucide-react";

// hooks
import { useFetchProductFeedMutation } from "@/features/products/productApiSlice";

const FetchProductDialog = () => {
  const { tenant_id } = useParams();
  const [open, setOpen] = React.useState(false);

  const [form, setForm] = React.useState({
    url: "",
    start_from: 0,
    end_at: 0,
  });

  const [fetchProductFeed, { isLoading }] = useFetchProductFeedMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "start_from" || name === "end_at" ? Number(value) : value,
    }));
  };

  const handleCreate = async () => {
    try {
      const res = await fetchProductFeed({ tenant_id, payload: form }).unwrap();

      if (res?.success) {
        toast.success(res?.message || "Product feed fetched successfully.");
        // setForm({ url: "", start_from: 0, end_at: 0 });
        // setOpen(false);
      } else {
        toast.error(
          res.error?.data?.message || "Failed to fetch product feed."
        );
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to fetch product feed.");
      console.error("Failed to fetch product feed:", err);
    }
  };

  React.useEffect(() => {
    if (open) {
      setForm({ url: "", start_from: 0, end_at: 0 });
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Rocket size={14} />
          <span className="mr-1">Product Feed</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="lg:max-w-xl w-full">
        <DialogHeader>
          <DialogTitle>Train Product Feed</DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-2">
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              name="url"
              value={form.url}
              onChange={handleChange}
              placeholder="https://example.com/products-feed"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_from">Starting From</Label>
              <Input
                id="start_from"
                name="start_from"
                type="number"
                value={form.start_from}
                onChange={handleChange}
                placeholder="Ex. 0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_at">Ending At</Label>
              <Input
                id="end_at"
                name="end_at"
                type="number"
                value={form.end_at}
                onChange={handleChange}
                placeholder="Ex. 200"
              />
            </div>
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
            {isLoading ? "Fetching..." : "Fetch"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FetchProductDialog;

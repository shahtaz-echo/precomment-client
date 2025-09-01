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
import { useCreateFAQLinkMutation } from "@/features/faqs/faqApiSlice";
import toast from "react-hot-toast";
import { useParams } from "react-router";

const CreateFAQLinkDialog = () => {
  const { tenant_id } = useParams();
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    url: "",
    description: "",
  });

  const [createFAQLink, { isLoading }] = useCreateFAQLinkMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    try {
      const res = await createFAQLink({ payload: form, tenant_id }).unwrap();

      if (res?.success) {
        toast.success(res?.message || "FAQ Link created successfully.");
        setForm({ name: "", url: "", description: "" });
        setOpen(false);
      } else {
        toast.error(res?.error.message || "Failed to create FAQ Link.");
      }
    } catch (err) {
      toast.error(err.data.message || "Failed to create FAQ Link.");
      console.error("Failed to create FAQ Link:", err);
    }
  };

  React.useEffect(() => {
    if (open) {
      setForm({ name: "", url: "", description: "" });
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus size={14} />
          <span className="mr-1">FAQ Link</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="lg:max-w-xl w-full">
        <DialogHeader>
          <DialogTitle>Create FAQ Link</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter FAQ link name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              name="url"
              value={form.url}
              onChange={handleChange}
              placeholder="https://example.com/faqs"
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

export default CreateFAQLinkDialog;

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const DeleteDialog = ({
  title = "Are you sure?",
  description = "This action cannot be undone.",
  onConfirm,
  trigger,
  open,
  setOpen,
  isLoading = false,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="sm:max-w-[465px]">
        <div className="bg-red-100 h-12 w-12 center rounded-full">
          <Trash2 size={24} className="text-red-500" />
        </div>

        <h3>{title}</h3>

        <p className="mb-8">{description}</p>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            className="bg-red-600 text-white hover:bg-red-700 min-w-20"
            onClick={onConfirm}
          >
            {isLoading ? (
              <span className="flex space-x-1">
                <span className="h-1.5 w-1.5 bg-white rounded-full animate-bounce"></span>
                <span className="h-1.5 w-1.5 bg-white rounded-full animate-bounce [animation-delay:-.2s]"></span>
                <span className="h-1.5 w-1.5 bg-white rounded-full animate-bounce [animation-delay:-.4s]"></span>
              </span>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;

import React from "react";
import { useDisconnect } from "wagmi";
import { Loader2, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteProfileDialogProps {
  onConfirm: () => Promise<void>;
}

export function DeleteProfileDialog({ onConfirm }: DeleteProfileDialogProps) {
  const { disconnect } = useDisconnect();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      closeRef.current?.click();
      // Logout
      disconnect();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild ref={closeRef}>
        <Button variant="outline">
          <Trash2 className="w-4 h-4" />
          <span className="sr-only">Delete Profile</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Profile</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete your profile? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end space-x-4">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isDeleting}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Profile"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

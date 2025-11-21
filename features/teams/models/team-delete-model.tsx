import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTransition } from "react";
import { deleteTeam } from "../actions/delete-team.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoaderCircleIcon } from "lucide-react";

export function TeamDeleteModel({
  teamId,
  isOpen,
  setIsOpen,
}: {
  teamId: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onDelete = () => {
    startTransition(async () => {
      const response = await deleteTeam(teamId);
      if (response.success) {
        toast.success(response.message || "Team deleted successfully");
        setIsOpen(false);
        router.refresh();
      } else {
        toast.error(response.message || "An error occurred");
      }
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the team
            and remove all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="cursor-pointer"
            disabled={isPending}
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="cursor-pointer"
            disabled={isPending}
            onClick={onDelete}
          >
            {isPending ? (
              <LoaderCircleIcon className="size-4 animate-spin" />
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

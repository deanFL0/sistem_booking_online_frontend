import { Link } from "react-router"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"

type DeleteConfirmationDialogProps<TData> = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void> | void;
    message: string;
    isLoading?: boolean;
};

export function DeleteConfirmationDialog<TData>({
    isOpen,
    onClose,
    onConfirm,
    message,
    isLoading = false,
}: DeleteConfirmationDialogProps<TData>) {
    const handleConfirm = async () => {
        await onConfirm();
        onClose();
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {message}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                    {(
                        <AlertDialogAction
                            variant="destructive"
                            onClick={handleConfirm}
                            disabled={isLoading}
                        >
                            {isLoading ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
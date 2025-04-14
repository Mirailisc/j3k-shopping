import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Review } from '@/types/review';

type Props = {
  deleteTarget: { single?: Review; multiple?: boolean } | null
  confirmDelete: () => void
  selectedCount: number
  deleteDialogOpen: boolean
  setDeleteDialogOpen: (open: boolean) => void
}

const ReviewTableAlert: React.FC<Props> = ({
  deleteTarget,
  confirmDelete,
  selectedCount,
  deleteDialogOpen,
  setDeleteDialogOpen,
}: Props) => {
  return (
    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {deleteTarget?.single
              ? `This will permanently delete the review "${deleteTarget.single.id}".`
              : `This will permanently delete ${selectedCount} selected reviews.`}
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ReviewTableAlert

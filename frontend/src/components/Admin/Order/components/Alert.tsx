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
import { Order } from '@/types/order';

type Props = {
  deleteTarget: { single?: Order; multiple?: boolean } | null
  confirmDelete: () => void
  selectedCount: number
  deleteDialogOpen: boolean
  setDeleteDialogOpen: (open: boolean) => void
}

const OrderTableAlert: React.FC<Props> = ({
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
              ? `This will permanently delete the order "${deleteTarget.single.id}".`
              : `This will permanently delete ${selectedCount} selected orders.`}
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

export default OrderTableAlert

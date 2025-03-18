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
import { User } from '../../../../types/user'

type Props = {
  deleteTarget: { single?: User; multiple?: boolean } | null
  confirmDelete: () => void
  selectedCount: number
  deleteDialogOpen: boolean
  setDeleteDialogOpen: (open: boolean) => void
}

const UserTableAlert: React.FC<Props> = ({
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
              ? `This will permanently delete the user "${deleteTarget.single.username}".`
              : `This will permanently delete ${selectedCount} selected users.`}
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

export default UserTableAlert

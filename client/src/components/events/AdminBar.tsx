import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AdminBarProps {
  onCreateClick?: () => void;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  showEdit?: boolean;
  showDelete?: boolean;
}

export const AdminBar = ({
  onCreateClick,
  onEditClick,
  onDeleteClick,
  showEdit = false,
  showDelete = false,
}: AdminBarProps) => {
  const { isAdmin } = useAuth();

  if (!isAdmin) return null;

  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col gap-3">
      <Button
        onClick={onCreateClick}
        className="bg-[#CC0033] hover:bg-[#CC0033]/90 shadow-xl h-14 w-14 rounded-full"
        size="icon"
        aria-label="Create event"
        data-testid="admin-create-button"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {showEdit && onEditClick && (
        <Button
          onClick={onEditClick}
          className="bg-[#5F6A72] hover:bg-[#5F6A72]/90 shadow-xl h-12 w-12 rounded-full"
          size="icon"
          aria-label="Edit event"
          data-testid="admin-edit-button"
        >
          <Edit className="w-5 h-5" />
        </Button>
      )}

      {showDelete && onDeleteClick && (
        <Button
          onClick={onDeleteClick}
          variant="destructive"
          className="shadow-xl h-12 w-12 rounded-full"
          size="icon"
          aria-label="Delete event"
          data-testid="admin-delete-button"
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
};

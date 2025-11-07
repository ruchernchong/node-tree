"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { deleteLink, reorderLinks, toggleLinkActive } from "@/actions/links";
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
import { Button } from "@/components/ui/button";

interface LinkItem {
  id: string;
  slug: string;
  title: string;
  url: string;
  description: string | null;
  isActive: boolean | null;
}

interface SortableLinksListProps {
  initialLinks: LinkItem[];
}

interface SortableItemProps {
  link: LinkItem;
}

const SortableItem = ({ link }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: link.id });
  const router = useRouter();
  const [isTogglingActive, setIsTogglingActive] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleToggleActive = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsTogglingActive(true);
    try {
      await toggleLinkActive(link.id);
      toast.success(
        link.isActive
          ? "Link deactivated successfully"
          : "Link activated successfully",
      );
      router.refresh();
    } catch (error) {
      toast.error("Failed to toggle link");
      console.error("Failed to toggle link:", error);
    } finally {
      setIsTogglingActive(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteLink(link.id);
      toast.success("Link deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete link");
      console.error("Failed to delete link:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-center justify-between p-4 border-b last:border-b-0 bg-background"
      >
        <div className="flex items-center gap-4 flex-1">
          {/* Drag handle */}
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
            aria-label="Drag to reorder"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <title>Drag handle</title>
              <circle cx="9" cy="5" r="1" />
              <circle cx="9" cy="12" r="1" />
              <circle cx="9" cy="19" r="1" />
              <circle cx="15" cy="5" r="1" />
              <circle cx="15" cy="12" r="1" />
              <circle cx="15" cy="19" r="1" />
            </svg>
          </button>

          <div className="flex flex-col gap-1 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{link.title}</span>
              {link.isActive ? (
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                  Active
                </span>
              ) : (
                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  Inactive
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>/{link.slug}</span>
              <span>→</span>
              <span className="truncate max-w-md">{link.url}</span>
            </div>
            {link.description && (
              <p className="text-sm text-muted-foreground">
                {link.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleToggleActive}
            disabled={isTogglingActive}
            variant="outline"
            size="sm"
          >
            {isTogglingActive
              ? "..."
              : link.isActive
                ? "Deactivate"
                : "Activate"}
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/links/${link.id}/edit`}>Edit</Link>
          </Button>
          <Button
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
            variant="destructive"
            size="sm"
          >
            {isDeleting ? "..." : "Delete"}
          </Button>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Link</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{link.title}"? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export const SortableLinksList = ({ initialLinks }: SortableLinksListProps) => {
  const [links, setLinks] = useState(initialLinks);
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);

        // Optimistically update order, then sync with server
        reorderLinks(newItems.map((item) => item.id))
          .then(() => {
            toast.success("Links reordered successfully");
            router.refresh();
          })
          .catch((error) => {
            toast.error("Failed to reorder links");
            console.error("Failed to reorder:", error);
            // Revert on error
            setLinks(items);
          });

        return newItems;
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={links} strategy={verticalListSortingStrategy}>
        <div className="rounded-lg border bg-card">
          {links.map((link) => (
            <SortableItem key={link.id} link={link} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

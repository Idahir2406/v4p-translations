import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2Icon } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  translationsService,
  type TranslationTable,
} from "~/services/translationsService";

interface DeleteDialogProps {
  table: TranslationTable;
}

export const DeleteDialog = ({ table }: DeleteDialogProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => translationsService.remove(table.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["translations-tables"] });
      toast.success(`Tabla "${table.table_name}" eliminada`);
      setOpen(false);
    },
    onError: () => {
      toast.error("Error al eliminar la tabla");
    },
  });

  const handleConfirm = () => {
    mutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-xs" aria-label="Eliminar tabla">
          <Trash2Icon className="text-destructive" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar tabla de traducción</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar <strong>{table.table_name}</strong>?
            Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

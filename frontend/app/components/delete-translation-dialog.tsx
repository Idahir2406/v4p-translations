import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
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
import { Badge } from "~/components/ui/badge";
import {
  managerService,
  type ClienteTranslation,
} from "~/services/managerService";

interface DeleteTranslationDialogProps {
  translation: ClienteTranslation;
}

export const DeleteTranslationDialog = ({
  translation,
}: DeleteTranslationDialogProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => managerService.deleteTranslation(translation.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["translation-table"] });
      toast.success("Traducción eliminada correctamente");
      setOpen(false);
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "No se pudo eliminar la traducción";
      toast.error(message);
    },
  });

  const handleDelete = () => {
    mutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 text-destructive hover:text-destructive"
          aria-label="Eliminar traducción"
          tabIndex={0}
        >
          <Trash2Icon className="size-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Eliminar traducción</DialogTitle>
          <DialogDescription>
            Esta acción elimina permanentemente el registro seleccionado.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{translation.identifier}</Badge>
          <Badge variant="secondary">{translation.field}</Badge>
          <Badge>{translation.lang.toUpperCase()}</Badge>
        </div>

        <p className="max-h-28 overflow-auto rounded-md border bg-muted/40 p-2 text-sm text-muted-foreground">
          {translation.value || "Sin valor"}
        </p>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={mutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              "Eliminar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


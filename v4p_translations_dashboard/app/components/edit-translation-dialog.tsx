import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PencilIcon, SaveIcon, Loader2Icon } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Badge } from "~/components/ui/badge";
import {
  managerService,
  type ClienteTranslation,
} from "~/services/managerService";

interface EditTranslationDialogProps {
  translation: ClienteTranslation;
}

const LANG_LABELS: Record<string, string> = {
  en: "Inglés",
  fr: "Francés",
  pt: "Portugués",
  ca: "Catalán",
  es: "Español",
};

export const EditTranslationDialog = ({
  translation,
}: EditTranslationDialogProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(translation.value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open) {
      setValue(translation.value);
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [open, translation.value]);

  const mutation = useMutation({
    mutationFn: (newValue: string) =>
      managerService.updateTranslation(translation.id, newValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["translation-table"] });
      toast.success("Traducción actualizada correctamente");
      setOpen(false);
    },
    onError: () => {
      toast.error("Error al actualizar la traducción");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    if (trimmed === translation.value) {
      setOpen(false);
      return;
    }
    mutation.mutate(trimmed);
  };

  const hasChanges = value.trim() !== translation.value;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="ghost"
        size="icon"
        className="size-7 transition-opacity "
        onClick={() => setOpen(true)}
        aria-label="Editar traducción"
        tabIndex={0}
      >
        <PencilIcon className="size-3.5" />
      </Button>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar traducción</DialogTitle>
          <DialogDescription>
            Modifica el valor de la traducción para este registro.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Badge variant="outline">{translation.identifier}</Badge>
          <Badge variant="secondary">{translation.field}</Badge>
          <Badge>{LANG_LABELS[translation.lang] ?? translation.lang}</Badge>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="translation-value"
              className="text-sm font-medium text-foreground"
            >
              Valor
            </label>
            <textarea
              ref={textareaRef}
              id="translation-value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={4}
              className="w-full resize-y rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:opacity-50"
              aria-label="Valor de la traducción"
              disabled={mutation.isPending}
            />
          </div>

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
              type="submit"
              disabled={mutation.isPending || !hasChanges || !value.trim()}
            >
              {mutation.isPending ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                <SaveIcon className="size-4" />
              )}
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

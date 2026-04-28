import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PencilIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  TranslationTableForm,
  type TranslationTableFormValues,
} from "./translate-dialog-form";
import {
  translationsService,
  type TranslationTable,
} from "~/services/translationsService";

const parseColumns = (raw: string): string[] =>
  raw.split(",").map((c) => c.trim()).filter(Boolean);

interface EditDialogProps {
  table: TranslationTable;
}

export const EditDialog = ({ table }: EditDialogProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: TranslationTableFormValues) =>
      translationsService.update(table.id, {
        table_name: values.table_name,
        columns: parseColumns(values.columns),
        identifier: values.identifier || undefined,
        field_name: values.field_name || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["translations-tables"] });
      toast.success("Tabla actualizada correctamente");
      setOpen(false);
    },
    onError: () => {
      toast.error("Error al actualizar la tabla");
    },
  });

  const handleSubmit = (values: TranslationTableFormValues) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-xs" aria-label="Editar tabla">
          <PencilIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar tabla de traducción</DialogTitle>
          <DialogDescription>
            Modifica la configuración de <strong>{table.table_name}</strong>.
          </DialogDescription>
        </DialogHeader>
        <TranslationTableForm
          defaultValues={table}
          onSubmit={handleSubmit}
          isLoading={mutation.isPending}
          submitLabel="Actualizar"
        />
      </DialogContent>
    </Dialog>
  );
};

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";
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
import { translationsService } from "~/services/translationsService";

const parseColumns = (raw: string): string[] =>
  raw.split(",").map((c) => c.trim()).filter(Boolean);

export const CreateDialog = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: TranslationTableFormValues) =>
      translationsService.create({
        table_name: values.table_name,
        columns: parseColumns(values.columns),
        identifier: values.identifier || undefined,
        field_name: values.field_name || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["translations-tables"] });
      toast.success("Tabla creada correctamente");
      setOpen(false);
    },
    onError: () => {
      toast.error("Error al crear la tabla");
    },
  });

  const handleSubmit = (values: TranslationTableFormValues) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon />
          Crear tabla
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear tabla de traducción</DialogTitle>
          <DialogDescription>
            Agrega una nueva tabla para traducir sus columnas.
          </DialogDescription>
        </DialogHeader>
        <TranslationTableForm
          onSubmit={handleSubmit}
          isLoading={mutation.isPending}
          submitLabel="Crear"
        />
      </DialogContent>
    </Dialog>
  );
};

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v3";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import type { TranslationTable } from "~/services/translationsService";

export const translationTableSchema = z.object({
  table_name: z.string().min(1, "El nombre de tabla es requerido"),
  columns: z.string().min(1, "Las columnas son requeridas"),
  identifier: z.string().optional(),
  field_name: z.string().optional(),
});

export type TranslationTableFormValues = z.infer<typeof translationTableSchema>;

interface TranslationTableFormProps {
  defaultValues?: TranslationTable;
  onSubmit: (values: TranslationTableFormValues) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export const TranslationTableForm = ({
  defaultValues,
  onSubmit,
  isLoading = false,
  submitLabel = "Guardar",
}: TranslationTableFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TranslationTableFormValues>({
    resolver: zodResolver(translationTableSchema),
    defaultValues: defaultValues
      ? {
          table_name: defaultValues.table_name,
          columns: defaultValues.columns.join(", "),
          identifier: defaultValues.identifier ?? "",
          field_name: defaultValues.field_name ?? "",
        }
      : { table_name: "", columns: "", identifier: "", field_name: "" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="table_name" className="text-sm font-medium">
          Nombre de tabla *
        </label>
        <Input id="table_name" placeholder="ej: sites1" {...register("table_name")} />
        {errors.table_name && (
          <p className="text-destructive text-xs">{errors.table_name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="columns" className="text-sm font-medium">
          Columnas * <span className="text-muted-foreground font-normal">(separadas por coma)</span>
        </label>
        <Input id="columns" placeholder="ej: name_l1, description_l1" {...register("columns")} />
        {errors.columns && (
          <p className="text-destructive text-xs">{errors.columns.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="identifier" className="text-sm font-medium">
          Identifier <span className="text-muted-foreground font-normal">(default: id)</span>
        </label>
        <Input id="identifier" placeholder="ej: idback" {...register("identifier")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="field_name" className="text-sm font-medium">
          Field name <span className="text-muted-foreground font-normal">(columna CMS)</span>
        </label>
        <Input id="field_name" placeholder="ej: variable" {...register("field_name")} />
      </div>

      <Button type="submit" disabled={isLoading} className="mt-2">
        {isLoading ? "Guardando..." : submitLabel}
      </Button>
    </form>
  );
};

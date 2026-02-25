import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeftIcon,
  DatabaseIcon,
  LanguagesIcon,
  LogOutIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { useEffect } from "react";
import { TranslateDialog } from "~/components/translate-dialog";
import { CreateDialog } from "~/components/create-dialog";
import { EditDialog } from "~/components/edit-dialog";
import { DeleteDialog } from "~/components/delete-dialog";
import { translationsService } from "~/services/translationsService";
import { managerService } from "~/services/managerService";
import { TableContainer } from "~/components/table-container";
import { authTokenStorage } from "~/lib/api";
import { Button } from "~/components/ui/button";
import { authService } from "~/services/authService";

export const TranslationsTable = () => {
  const token = authTokenStorage.get();
  const { data, isLoading } = useQuery({
    queryKey: ["translations-tables"],
    queryFn: () => translationsService.getAll(),
    enabled: Boolean(token),
  });

  return (
    <Card className="border-border/60 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <DatabaseIcon className="size-5 text-primary" />
          <CardTitle className="text-lg">Tablas de traducción</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <TranslateDialog />
          <CreateDialog />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="size-6 animate-spin rounded-full border-2 border-accent border-t-primary" />
            <span className="ml-3 text-sm text-muted-foreground">
              Cargando tablas...
            </span>
          </div>
        ) : (
          <div className="max-h-[75vh] overflow-y-auto rounded-lg border">
            <Table>
              <TableHeader className="sticky top-0 z-10">
                <TableRow className="divide-x divide-accent-foreground/10 border-b-0 hover:bg-transparent">
                  <TableHead className="bg-accent text-accent-foreground font-semibold">
                    Table Name
                  </TableHead>
                  <TableHead className="bg-accent text-accent-foreground font-semibold">
                    Columns
                  </TableHead>
                  <TableHead className="bg-accent text-accent-foreground font-semibold">
                    Identifier
                  </TableHead>
                  <TableHead className="bg-accent text-accent-foreground font-semibold">
                    Field Name
                  </TableHead>
                  <TableHead className="bg-accent text-accent-foreground w-24 text-center font-semibold">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((table) => (
                  <TableRow key={table.id} className="divide-x divide-border">
                    <TableCell className="font-medium">
                      <Link className="hover:underline" to={`/translation-table/${table.id}`}>{table.table_name}</Link>
                    </TableCell>
                    <TableCell className="max-w-60">
                      <div className="flex flex-wrap gap-1">
                        {table.columns.map((col) => (
                          <Badge
                            key={col}
                            variant="secondary"
                            className="text-xs font-normal"
                          >
                            {col}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {table.identifier ?? "id"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {table.field_name ?? "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <EditDialog table={table} />
                        <DeleteDialog table={table} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {data?.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-12 text-center text-muted-foreground"
                    >
                      No hay tablas configuradas
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function TranslationTablePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const token = authTokenStorage.get();
  const tableId = id ?? "";
  const lang = searchParams.get("lang") || undefined;
  const field = searchParams.get("field") || undefined;

  const handleLogout = () => {
    authService.logout();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate, token]);

  const { data: filterOptions } = useQuery({
    queryKey: ["filter-options", tableId],
    queryFn: () => managerService.getFilterOptions(tableId),
    enabled: Boolean(tableId && token),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["translation-table", tableId, lang, field],
    queryFn: () => managerService.getTranslations({ id: tableId, lang, field }),
    enabled: Boolean(tableId && token),
  });

  const tableName =
    data?.translationTable.table_name ?? filterOptions?.translationTable.table_name;

  if (!tableId) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center text-muted-foreground">
          ID de tabla inválido
        </div>
      </main>
    );
  }

  if (!token) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted transition-colors hover:bg-muted/70"
            aria-label="Volver al inicio"
            tabIndex={0}
          >
            <ArrowLeftIcon className="size-4 text-foreground" />
          </Link>
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary">
            <LanguagesIcon className="size-5 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold leading-tight text-foreground">
              {tableName ?? "Cargando..."}
            </h1>
            <div className="text-xs text-muted-foreground">
              Traducciones configuradas
            </div>
          </div>
          <div className="ml-auto">
            <Button
              type="button"
              variant="outline"
              onClick={handleLogout}
              aria-label="Cerrar sesión"
            >
              <LogOutIcon className="mr-2 size-4" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="size-6 animate-spin rounded-full border-2 border-accent border-t-primary" />
            <span className="ml-3 text-sm text-muted-foreground">
              Cargando traducciones...
            </span>
          </div>
        ) : data ? (
          <TableContainer
            translations={data.clienteTranslations}
            availableFields={filterOptions?.fields ?? []}
            availableLangs={filterOptions?.langs ?? []}
          />
        ) : (
          <p className="py-20 text-center text-muted-foreground">
            No se encontraron datos
          </p>
        )}
      </div>
    </main>
  );
}

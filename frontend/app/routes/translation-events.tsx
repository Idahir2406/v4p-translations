import { useQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircleIcon, CheckCircle2Icon, LoaderCircleIcon, LogOutIcon, PlayIcon, RefreshCwIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { Route } from './+types/translation-events';
import { AppNavbar } from "~/components/app-navbar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { translationEventsService } from '~/services/translationEventsService';
import { authService } from "~/services/authService";
import { authTokenStorage } from "~/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';


export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "Eventos de traducción" },
    { name: "description", content: "Eventos de traducción" },
  ];
}

export default function TranslationEventsPage() {
  const [status, setStatus] = useState("all");
  const navigate = useNavigate();
  const token = authTokenStorage.get();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate, token]);

  const { data, isLoading } = useQuery({
    queryKey: ["translation-events", status],
    queryFn: () =>
      translationEventsService.findAll({
        status: status === "all" ? undefined : status,
      }),
    enabled: Boolean(token),
  });

  const processPendingMutation = useMutation({
    mutationFn: () => translationEventsService.processPending(100),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["translation-events"] });
      toast.success(response.message, {
        description: `Eventos procesados: ${response.processedEvents}, filas traducidas: ${response.translatedRows}, errores: ${response.errors}`,
      });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "No se pudo procesar eventos";
      toast.error(message);
    },
  });

  const counters = useMemo(() => {
    const events = data ?? [];
    return {
      total: events.length,
      pending: events.filter((event) => event.status === "pending").length,
      processed: events.filter((event) => event.status === "processed").length,
      error: events.filter((event) => event.status === "error").length,
    };
  }, [data]);

  const handleLogout = () => {
    authService.logout();
    navigate("/login", { replace: true });
  };

  const handleProcessPending = () => {
    processPendingMutation.mutate();
  };

  if (!token) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      <AppNavbar
        backTo="/"
        title="Eventos de traducción"
        subtitle="Monitorea y procesa cambios pendientes"
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => queryClient.invalidateQueries({ queryKey: ["translation-events"] })}
              aria-label="Actualizar lista de eventos"
            >
              <RefreshCwIcon className="mr-2 size-4" />
              Actualizar
            </Button>
            <Button
              type="button"
              onClick={handleProcessPending}
              disabled={processPendingMutation.isPending}
              aria-label="Procesar eventos pendientes"
            >
              {processPendingMutation.isPending ? (
                <LoaderCircleIcon className="mr-2 size-4 animate-spin" />
              ) : (
                <PlayIcon className="mr-2 size-4" />
              )}
              Procesar pendientes
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleLogout}
              aria-label="Cerrar sesión"
            >
              <LogOutIcon className="mr-2 size-4" />
              Cerrar sesión
            </Button>
          </>
        }
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Card className="border-border/60 shadow-md">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Historial de eventos</CardTitle>
              <CardDescription>
                Total: {counters.total} | Pendientes: {counters.pending} | Procesados: {counters.processed} | Error: {counters.error}
              </CardDescription>
            </div>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="processed">Procesado</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <LoaderCircleIcon className="size-5 animate-spin text-primary" />
                <span className="ml-2 text-sm text-muted-foreground">Cargando eventos...</span>
              </div>
            ) : (
              <div className="max-h-[70vh] overflow-y-auto rounded-lg border">
                <Table>
                  <TableHeader className="sticky top-0 z-10">
                    <TableRow className="divide-x divide-accent-foreground/10 border-b-0 hover:bg-transparent">
                      <TableHead className="bg-accent text-accent-foreground font-semibold">ID</TableHead>
                      <TableHead className="bg-accent text-accent-foreground font-semibold">Tabla</TableHead>
                      <TableHead className="bg-accent text-accent-foreground font-semibold">Campo</TableHead>
                      <TableHead className="bg-accent text-accent-foreground font-semibold">Identifier</TableHead>
                      <TableHead className="bg-accent text-accent-foreground font-semibold">Nuevo valor</TableHead>
                      <TableHead className="bg-accent text-accent-foreground font-semibold">Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.map((event) => (
                      <TableRow key={event.id} className="divide-x divide-border align-top">
                        <TableCell className="font-medium">{event.id}</TableCell>
                        <TableCell>{event.table_name}</TableCell>
                        <TableCell>{event.field}</TableCell>
                        <TableCell>{event.identifier}</TableCell>
                        <TableCell className="max-w-104 whitespace-pre-wrap wrap-break-word text-muted-foreground">
                          {event.new_value || "—"}
                        </TableCell>
                        <TableCell>
                          {event.status === "processed" ? (
                            <Badge variant="default">
                              <CheckCircle2Icon className="size-3" />
                              Procesado
                            </Badge>
                          ) : null}
                          {event.status === "pending" ? (
                            <Badge variant="secondary">
                              <LoaderCircleIcon className="size-3" />
                              Pendiente
                            </Badge>
                          ) : null}
                          {event.status === "error" ? (
                            <Badge variant="destructive">
                              <AlertCircleIcon className="size-3" />
                              Error
                            </Badge>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    ))}

                    {data?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                          No hay eventos para el filtro seleccionado
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
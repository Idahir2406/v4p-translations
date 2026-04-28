import { useState, useRef, useEffect, useCallback } from "react";
import { PlayIcon, SquareIcon, CheckCircleIcon, XCircleIcon } from "lucide-react";
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
import { API_URL } from "~/constants";
import { useSearchParams } from "react-router";
import { LanguajeSelector } from "./languajeSelector";
import { authTokenStorage } from "~/lib/api";
import { cronConfigService } from "~/services/cronConfigService";

interface LogEntry {
  type: "info" | "warn" | "error" | "progress" | "complete";
  message: string;
  timestamp: string;
}

type TranslateStatus = "idle" | "running" | "completed" | "error";

const LOG_COLORS: Record<string, string> = {
  error: "text-red-500",
  warn: "text-amber-500",
  complete: "text-emerald-500 font-semibold",
  progress: "text-primary",
  info: "text-foreground/70",
};

export const TranslateDialog = () => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<TranslateStatus>("idle");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [cronInterval, setCronInterval] = useState("360");
  const [allowedIntervals, setAllowedIntervals] = useState<number[]>([]);
  const [cronMessage, setCronMessage] = useState("");
  const [isCronLoading, setIsCronLoading] = useState(false);
  const [isCronSaving, setIsCronSaving] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const lang = searchParams.get("lang") ?? "en";
  useEffect(() => {
    const container = logsContainerRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [logs]);

  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  const handleLoadCronConfig = useCallback(async () => {
    const token = authTokenStorage.get();
    if (!token) {
      return;
    }

    setIsCronLoading(true);
    setCronMessage("");
    try {
      const config = await cronConfigService.get();
      setCronInterval(String(config.intervalMinutes));
      setAllowedIntervals(config.allowedIntervals);
    } catch {
      setCronMessage("No se pudo cargar la configuracion del cron.");
    } finally {
      setIsCronLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    void handleLoadCronConfig();
  }, [open, handleLoadCronConfig]);

  const handleSaveCronConfig = async () => {
    const intervalMinutes = Number(cronInterval);
    if (!Number.isInteger(intervalMinutes)) {
      setCronMessage("Selecciona un intervalo valido.");
      return;
    }

    setIsCronSaving(true);
    setCronMessage("");
    try {
      const updatedConfig = await cronConfigService.update(intervalMinutes);
      setCronInterval(String(updatedConfig.intervalMinutes));
      setAllowedIntervals(updatedConfig.allowedIntervals);
      setCronMessage("Intervalo del cron actualizado correctamente.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo actualizar el cron.";
      setCronMessage(message);
    } finally {
      setIsCronSaving(false);
    }
  };

  const handleStart = useCallback(() => {
    const token = authTokenStorage.get();
    if (!token) {
      setStatus("error");
      setLogs([
        {
          type: "error",
          message: "Sesion expirada. Inicia sesion nuevamente.",
          timestamp: new Date().toISOString(),
        },
      ]);
      return;
    }

    setStatus("running");
    setLogs([]);

    const streamUrl = new URL(`${API_URL}/translations/stream`);
    streamUrl.searchParams.set("lang", lang);
    streamUrl.searchParams.set("access_token", token);

    const es = new EventSource(streamUrl.toString());
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as LogEntry;
        setLogs((prev) => [...prev, data]);

        if (data.type === "complete") {
          setStatus("completed");
          es.close();
        }
        if (data.type === "error") {
          setStatus("error");
          es.close();
        }
      } catch {
        /* ignore parse errors */
      }
    };

    es.onerror = () => {
      es.close();
      setStatus((prev) => (prev === "running" ? "completed" : prev));
    };
  }, [lang]);

  const handleStop = useCallback(() => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
    setLogs((prev) => [
      ...prev,
      {
        type: "warn",
        message: "Proceso detenido por el usuario",
        timestamp: new Date().toISOString(),
      },
    ]);
    setStatus("idle");
  }, []);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
      setStatus("idle");
      setLogs([]);
    }
    setOpen(nextOpen);
  };

  const statusIcon =
    status === "completed" ? (
      <CheckCircleIcon className="size-5 text-emerald-500" />
    ) : status === "error" ? (
      <XCircleIcon className="size-5 text-red-500" />
    ) : null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" aria-label="Iniciar traducciones">
          <PlayIcon className="size-4" />
          Traducir
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Ejecutar traducciones
            {statusIcon}
          </DialogTitle>
          <DialogDescription>
            Inicia el proceso de traducción para todas las tablas configuradas.
            Los logs se mostrarán en tiempo real.
          </DialogDescription>
        </DialogHeader>

        <LanguajeSelector value={lang} onChange={(value) => setSearchParams({ lang: value })} />
        <div className="rounded-lg border bg-muted/20 p-3">
          <p className="text-sm font-medium">Ejecucion automatica</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Configura cada cuanto tiempo se ejecuta la traduccion automatica.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
            <select
              value={cronInterval}
              onChange={(event) => setCronInterval(event.target.value)}
              disabled={isCronLoading || isCronSaving}
              className="h-9 rounded-md border bg-background px-3 text-sm"
              aria-label="Intervalo del cron en minutos"
            >
              {(allowedIntervals.length > 0 ? allowedIntervals : [15, 30, 60, 180, 360, 720, 1440]).map(
                (interval) => (
                  <option key={interval} value={interval}>
                    {interval} minutos
                  </option>
                ),
              )}
            </select>
            <Button
              type="button"
              variant="secondary"
              onClick={handleSaveCronConfig}
              disabled={isCronLoading || isCronSaving}
              aria-label="Guardar intervalo de cron"
            >
              {isCronSaving ? "Guardando..." : "Guardar intervalo"}
            </Button>
          </div>
          {cronMessage ? (
            <p className="mt-2 text-xs text-muted-foreground">{cronMessage}</p>
          ) : null}
        </div>
        <div
          ref={logsContainerRef}
          className="h-80 overflow-y-auto rounded-lg border bg-muted/30 p-3 font-mono text-xs leading-relaxed"
          role="log"
          aria-live="polite"
          aria-label="Logs de traducción"
          tabIndex={0}
        >
          {logs.length === 0 && status === "idle" && (
            <p className="text-muted-foreground">
              Presiona &quot;Iniciar&quot; para comenzar el proceso de
              traducción...
            </p>
          )}
          {logs.map((log, i) => (
            <div key={i} className="flex gap-2 py-0.5">
              <span className="shrink-0 tabular-nums text-muted-foreground/50">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <span className={LOG_COLORS[log.type] ?? "text-foreground"}>
                {log.message}
              </span>
            </div>
          ))}
        </div>

        <DialogFooter>
          {status === "idle" && (
            <Button onClick={handleStart}>
              <PlayIcon className="size-4" />
              Iniciar traducción
            </Button>
          )}
          {status === "running" && (
            <Button variant="destructive" onClick={handleStop}>
              <SquareIcon className="size-4" />
              Detener
            </Button>
          )}
          {(status === "completed" || status === "error") && (
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cerrar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

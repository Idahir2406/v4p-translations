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

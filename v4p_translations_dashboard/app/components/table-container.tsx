import { useVirtualizer } from "@tanstack/react-virtual";
import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import type { ClienteTranslation } from "~/services/managerService";
import { Badge } from "~/components/ui/badge";
import { EditTranslationDialog } from "./edit-translation-dialog";

interface TableContainerProps {
  translations: ClienteTranslation[];
  availableFields: string[];
  availableLangs: string[];
}

const LANG_LABELS: Record<string, string> = {
  en: "Inglés",
  fr: "Francés",
  pt: "Portugués",
  ca: "Catalán",
  es: "Español",
};

const GRID_COLS = "grid-cols-[140px_180px_70px_1fr_44px]";

export const TableContainer = ({
  translations,
  availableFields,
  availableLangs,
}: TableContainerProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");

  const currentLang = searchParams.get("lang") ?? "";
  const currentField = searchParams.get("field") ?? "";

  const filtered = useMemo(() => {
    if (!search.trim()) return translations;
    const q = search.toLowerCase();
    return translations.filter(
      (t) =>
        t.value.toLowerCase().includes(q) ||
        t.identifier.toLowerCase().includes(q)
    );
  }, [translations, search]);

  const rowVirtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 20,
  });

  const handleFilterChange = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next, { replace: true });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleFilterChange("lang", e.target.value);
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleFilterChange("field", e.target.value);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Buscar por valor o identifier..."
          value={search}
          onChange={handleSearchChange}
          className="h-9 w-64 rounded-md border border-input bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
          aria-label="Buscar traducciones"
        />

        <select
          value={currentLang}
          onChange={handleLangChange}
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
          aria-label="Filtrar por idioma"
        >
          <option value="">Todos los idiomas</option>
          {availableLangs.map((lang) => (
            <option key={lang} value={lang}>
              {LANG_LABELS[lang] ?? lang.toUpperCase()}
            </option>
          ))}
        </select>

        <select
          value={currentField}
          onChange={handleFieldChange}
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
          aria-label="Filtrar por campo"
        >
          <option value="">Todos los campos</option>
          {availableFields.map((field) => (
            <option key={field} value={field}>
              {field}
            </option>
          ))}
        </select>

        <span className="ml-auto text-xs text-muted-foreground">
          {filtered.length} registros
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <div
          className={`grid ${GRID_COLS} bg-accent text-sm font-semibold text-accent-foreground`}
        >
          <div className="border-r border-accent-foreground/10 px-3 py-2.5">
            Identifier
          </div>
          <div className="border-r border-accent-foreground/10 px-3 py-2.5">
            Field
          </div>
          <div className="border-r border-accent-foreground/10 px-3 py-2.5 text-center">
            Lang
          </div>
          <div className="border-r border-accent-foreground/10 px-3 py-2.5">
            Value
          </div>
          <div className="px-3 py-2.5 text-center" />
        </div>

        <div
          ref={parentRef}
          className="overflow-auto"
          style={{ height: "calc(100vh - 280px)" }}
        >
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
              No se encontraron traducciones
            </div>
          ) : (
            <div
              className="relative w-full"
              style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                const row = filtered[virtualItem.index];
                return (
                  <div
                    key={virtualItem.key}
                    className={`group absolute left-0 grid w-full ${GRID_COLS} border-b text-sm transition-colors hover:bg-muted/50`}
                    style={{
                      height: `${virtualItem.size}px`,
                      transform: `translateY(${virtualItem.start}px)`,
                    }}
                  >
                    <div
                      className="flex items-center truncate border-r px-3 font-medium"
                      title={row.identifier}
                    >
                      {row.identifier}
                    </div>
                    <div
                      className="flex items-center truncate border-r px-3 text-muted-foreground"
                      title={row.field}
                    >
                      {row.field}
                    </div>
                    <div className="flex items-center justify-center border-r">
                      <Badge
                        variant="outline"
                        className="px-1.5 py-0 text-[10px]"
                      >
                        {(LANG_LABELS[row.lang] ?? row.lang).toUpperCase()}
                      </Badge>
                    </div>
                    <div
                      className="flex items-center truncate border-r px-3"
                      title={row.value}
                    >
                      {row.value}
                    </div>
                    <div className="flex items-center justify-center">
                      <EditTranslationDialog translation={row} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

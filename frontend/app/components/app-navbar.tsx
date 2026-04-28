import type { ReactNode } from "react";
import { ArrowLeftIcon, LanguagesIcon } from "lucide-react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";

interface AppNavbarProps {
  title: string;
  subtitle?: string;
  backTo?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export const AppNavbar = ({
  title,
  subtitle,
  backTo,
  icon,
  actions,
  className,
}: AppNavbarProps) => {
  return (
    <header className={cn("sticky top-0 z-30 border-b bg-card/80 backdrop-blur-md", className)}>
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        {backTo ? (
          <Link
            to={backTo}
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted transition-colors hover:bg-muted/70"
            aria-label="Volver"
            tabIndex={0}
          >
            <ArrowLeftIcon className="size-4 text-foreground" />
          </Link>
        ) : null}

        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary">
          {icon ?? <LanguagesIcon className="size-5 text-primary-foreground" />}
        </div>

        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold leading-tight text-foreground">
            {title}
          </h1>
          {subtitle ? (
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>

        {actions ? <div className="ml-auto flex items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
};


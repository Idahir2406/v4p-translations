import { LanguagesIcon, LogOutIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { authService } from "~/services/authService";
import { TranslationsTable } from "../routes/translationTable";

export function Welcome() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/login", { replace: true });
  };

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary">
            <LanguagesIcon className="size-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight text-foreground">
              V4P Translations
            </h1>
            <p className="text-xs text-muted-foreground">
              Panel de configuración de traducciones
            </p>
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
        <TranslationsTable />
      </div>
    </main>
  );
}


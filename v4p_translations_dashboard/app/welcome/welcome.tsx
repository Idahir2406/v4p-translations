import { BellIcon, LogOutIcon } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { authService } from "~/services/authService";
import { TranslationsTable } from "../routes/translationTable";
import { AppNavbar } from "~/components/app-navbar";

export function Welcome() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/login", { replace: true });
  };

  return (
    <main className="min-h-screen bg-background">
      <AppNavbar
        title="V4P Translations"
        subtitle="Panel de configuración de traducciones"
        actions={
          <>
            <Link to="/translation-events">
              <Button type="button" variant="outline">
                <BellIcon className="mr-2 size-4" />
                Eventos de traducción
              </Button>
            </Link>
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
        <TranslationsTable />
      </div>
    </main>
  );
}


import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { authTokenStorage } from "~/lib/api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "V4P Translations Dashboard" },
    { name: "description", content: "Panel de configuración de traducciones" },
  ];
}

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!authTokenStorage.get()) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  if (!authTokenStorage.get()) {
    return null;
  }

  return <Welcome />;
}

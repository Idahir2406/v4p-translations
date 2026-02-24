import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "V4P Translations Dashboard" },
    { name: "description", content: "Panel de configuración de traducciones" },
  ];
}

export default function Home() {
  return <Welcome />;
}

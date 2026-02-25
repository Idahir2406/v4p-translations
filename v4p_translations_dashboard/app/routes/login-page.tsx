import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod/v3";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import type { Route } from "./+types/login-page";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { authService } from "~/services/authService";
import { authTokenStorage } from "~/lib/api";

const formSchema = z.object({
  user: z.string().min(1, "El usuario es obligatorio"),
  password: z.string().min(8),
});

export const meta = ({}: Route.MetaArgs) => {
  return [{ title: "Login" }, { name: "description", content: "Login page" }];
};

export default function LoginPage() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: "",
      password: "",
    },
  });

  useEffect(() => {
    if (authTokenStorage.get()) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await authService.login(data);
      authTokenStorage.set(response.access_token);
      navigate("/", { replace: true });
    } catch {
      form.setError("root", {
        message: "Credenciales inválidas",
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <Controller
              control={form.control}
              name="user"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="user">Usuario</FieldLabel>
                  <Input
                    {...field}
                    id="user"
                    aria-invalid={fieldState.invalid}
                    autoComplete="username"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    {...field}
                    id="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="********"
                    type="password"
                    autoComplete="current-password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {form.formState.errors.root?.message ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.root.message}
              </p>
            ) : null}
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Ingresando..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

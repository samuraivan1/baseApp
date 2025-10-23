title: "Formularios y Validaciones (RHF + Zod)"
version: 1.0
status: active
last_sync: 2025-10-23
🧾 7. Formularios y Validaciones (React Hook Form + Zod)
El estándar de formularios combina:

React Hook Form (RHF) para el manejo de estado del formulario.

Zod para validación tipada y mensajes consistentes.

7.1 Patrón base
tsx

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "@/features/security/types/schemas";

export const UserForm = () => {
const { register, handleSubmit, formState } = useForm({
resolver: zodResolver(userSchema),
});

const onSubmit = (data) => console.log(data);

return (

<form onSubmit={handleSubmit(onSubmit)}>
<input {...register("email")} />
{formState.errors.email?.message}
<button type="submit">Guardar</button>
</form>
);
};
7.2 Schemas Zod
Ubicados en types/schemas.\*.ts dentro de cada feature.

ts

import { z } from "zod";

export const userSchema = z.object({
email: z.string().email("Correo inválido"),
password: z.string().min(8, "Mínimo 8 caracteres"),
});
7.3 Reglas
Cada formulario debe tener un schema único.

Las validaciones deben estar tipadas.

No se permiten condicionales con hooks RHF fuera de useForm.

Los mensajes de error se centralizan en .messages.ts.

7.4 Ejemplo real en baseApp
LoginPage usa React Hook Form + Zod:

tsx

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "./validationSchema";
import { authMessages } from "./LoginPage.messages";

const { register, handleSubmit, formState } = useForm({
resolver: zodResolver(loginSchema),
});

<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register("username")} placeholder={authMessages.username} />
  {formState.errors.username && <span>{authMessages.invalidUser}</span>}
</form>;

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { updateSheet } from "./actions"
import { useToast } from "../components/ui/use-toast"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Obrigatorio",
  }),
  dayEvaluation: z.enum(['Produtivo', 'Neutro', 'Improdutivo'], {
    required_error: "Obrigatorio",
    description: "Como você considera seu dia hoje?",
  }),
  materialsProduced: z.string({
    required_error: "Obrigatorio",
    description: "Quais materiais você produziu hoje?"
  }).min(1, { message: "Obrigatorio" }),
  observations: z.string({
    description: "Observações"
  }).optional()
});

export type FormValues = z.infer<typeof formSchema>;

export default function Home() {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  });

  const onSubmit = async (values: FormValues) => {
    const updateSpreadsheet = await updateSheet(values);

    if(updateSpreadsheet.status === "error") {
      toast({
        title: "Erro ao enviar formulário",
        description: "Tente novamente mais tarde",
        duration: 5000,
        variant: "destructive",
      });
      return;
    }

    if(updateSpreadsheet.status === "success") {
      toast({
        title: "Formulário enviado com sucesso",
        duration: 5000,
      });

      form.setValue("name", "");
      form.setValue("dayEvaluation", "Neutro");
      form.setValue("materialsProduced", "");
      form.setValue("observations", "");
    }
  }

  if(form.formState.isSubmitSuccessful) {
    return (
      <main className="flex justify-center items-center min-h-screen bg-slate-100">
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-3xl font-bold">Obrigado por enviar seu formulário</h1>
          <p className="text-gray-500">Seu formulário foi enviado com sucesso</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex justify-center items-center min-h-screen bg-slate-100">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full max-w-md p-8 bg-white shadow-md rounded-md">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Bob Jamaica" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />
          <FormField
            control={form.control}
            name="dayEvaluation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Como foi seu dia hoje?</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Produtivo">Produtivo</SelectItem>
                      <SelectItem value="Neutro">Neutro</SelectItem>
                      <SelectItem value="Improdutivo">Não produzi como gostaria</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />
          <FormField
            control={form.control}
            name="materialsProduced"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Escreva aqui quais materiais você produziu</FormLabel>
                <FormControl>
                  <Textarea placeholder="..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />
          <FormField
            control={form.control}
            name="observations"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex flex-row gap-2">Observações <p className="text-gray-500">(opcional)</p></FormLabel>
                <FormControl>
                  <Textarea placeholder="..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />
          <Button type="submit" disabled={form.formState.isLoading || form.formState.isSubmitting}>{form.formState.isSubmitting ? 'Enviando...' : 'Enviar'}</Button>
        </form>
      </Form>
    </main>
  )
}

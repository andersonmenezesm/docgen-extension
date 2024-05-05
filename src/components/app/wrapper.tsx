import { zodResolver } from "@hookform/resolvers/zod";
import { cnpj, cpf } from "cpf-cnpj-validator";
import { Copy, FileCheck2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Switch } from "../ui/switch";

const documentFormSchema = z.object({
  type: z.enum(["cpf", "cnpj"]),
});

type DocumentFormSchema = z.infer<typeof documentFormSchema>;

export function Wrapper() {
  const [document, setDocument] = useState<string>("");
  const [documentFormatted, setDocumentFormatted] = useState<string>("");
  const [isFormated, setIsFormated] = useState<boolean>(false);

  const form = useForm<DocumentFormSchema>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      type: "cpf",
    },
  });

  function handleSubmitGenerate(data: DocumentFormSchema) {
    const { type } = data;

    switch (type) {
      case "cpf":
        setDocument(cpf.generate());
        return document;
        break;
      case "cnpj":
        setDocument(cnpj.generate());
        return document;
        break;
    }
  }

  function handleIsFormated() {
    const type = form.getValues("type");
    console.log("formatando");

    if (isFormated) {
      switch (type) {
        case "cpf":
          setDocumentFormatted(cpf.format(document));
          break;
        case "cnpj":
          setDocumentFormatted(cnpj.format(document));
          break;
      }
    } else {
      setDocumentFormatted("");
    }
  }

  function handleClipBoardCopy() {
    navigator.clipboard.writeText(document);
  }

  useEffect(handleIsFormated, [isFormated, document, form]);

  return (
    <div className="flex flex-col items-center m-auto text-foreground h-screen w-[400px] gap-3 p-8 pb-4">
      <header className="mt-4 text-3xl font-bold tracking-tight w-full text-center">
        <div className="flex justify-center items-center gap-2 pb-4">
          <FileCheck2Icon className="text-emerald-500" size={30} />
          <h1 className="text-foreground">DocGen</h1>
        </div>
      </header>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmitGenerate)}
          className="flex flex-col gap-4 w-full text-center"
        >
          <span>Selecione qual tipo de documento</span>
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormControl>
                <RadioGroup
                  className="flex flex-col gap-3"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem id="cpf" value="cpf" />
                    </FormControl>
                    <FormLabel htmlFor="cpf">CPF</FormLabel>
                  </FormItem>

                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem id="cnpj" value="cnpj" />
                    </FormControl>
                    <FormLabel htmlFor="cnpj">CNPJ</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
            )}
          />

          <div className="flex items-center gap-2 justify-between pb-1">
            <div className="flex items-center space-x-2 space-y-0">
              <Switch
                id="formated"
                checked={isFormated}
                onCheckedChange={() =>
                  isFormated ? setIsFormated(false) : setIsFormated(true)
                }
              />
              <Label htmlFor="formated" className="text-sm">
                Formatado?
              </Label>
            </div>
            <Button className="bg-emerald-500" type="submit">
              Gerar
            </Button>
          </div>

          <div className="flex gap-1 relative">
            <Input
              id="document"
              type="text"
              placeholder="Documento gerado"
              readOnly
              maxLength={14}
              value={isFormated ? documentFormatted : document}
            />
            <Button
              variant="ghost"
              type="button"
              className="absolute right-0 top-0 hover:bg-emerald-500 group"
              onClick={handleClipBoardCopy}
            >
              <Copy
                size={16}
                className="text-gray-400 group-hover:bg-emerald-500 group-hover:text-gray-100"
              />
            </Button>
          </div>
        </form>
      </Form>

      <footer className="text-sm text-muted-foreground pt-6 pb-6">
        Produzido por &copy; Anderson Menezes - {new Date().getFullYear()}
      </footer>
    </div>
  );
}
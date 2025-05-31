// components/FormFieldComponent.tsx
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Control, FieldValues, Path } from "react-hook-form";

type FieldType = "input" | "text" | "number" | "select" | "textarea";

interface FormFieldComponentProps<T extends FieldValues> {
  name: Path<T>;
  control?: Control<T>;
  label?: string;
  type: FieldType;
  placeholder?: string;
  //   options?: string[]; // For select only
  mapItems?: string[];
}

export const FormFieldComponent = <T extends FieldValues>({
  name,
  control,
  label,
  type,
  placeholder,
  mapItems = [],
}: FormFieldComponentProps<T>) => {
  const renderField = (field: any) => {
    switch (type) {
      case "input":
      case "text":
      case "number":
        return (
          <Input
            {...field}
            placeholder={placeholder}
            type={type}
            className="input"
          />
        );

      case "textarea":
        return (
          <Textarea {...field} placeholder={placeholder} className="input" />
        );

      case "select":
        return (
          <Select
            onValueChange={field.onChange}
            value={field.value}
            defaultValue={field.value}
          >
            <SelectTrigger className="input capitalize">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {(mapItems ?? []).map((option) => (
                <SelectItem key={option} value={option} className="capitalize">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return null;
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>{renderField(field)}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
 
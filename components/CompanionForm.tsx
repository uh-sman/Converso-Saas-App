"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";

import { subjects, voiceType, voiceStyle } from "@/constants";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { FormFieldComponent } from "./FormFieldComponent";
import { createCompanion } from "@/lib/actions/companion.actions";
import { redirect } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, { message: "Companion is required." }),
  subject: z.string().min(1, { message: "Subject is required." }),
  topic: z.string().min(1, { message: "Topic is required." }),
  voice: z.string().min(1, { message: "Voice is required." }),
  style: z.string().min(1, { message: "Style is required." }),
  duration: z.coerce.number().min(1, { message: "Duration is required" }),
});
const CompanionForm = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      topic: "",
      voice: "",
      style: "",
      duration: 5,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // TODO: Handle form submission
    console.log("values", values)
    const companion = await createCompanion(values);

    if (companion) return redirect(`/companions/${companion.id}`);
    else {
      console.log("Failed to create companion"); // Handle form submission
      redirect("/");
    }
  };

  return (
    <Form {...form}> 
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormFieldComponent
          control={form.control}
          name="name"
          label="Companion Name"
          type={"input"}
          placeholder="Enter the companion name"
        />

        <FormFieldComponent
          control={form.control}
          name="subject"
          label="Subject"
          type="select"
          placeholder="Select a subject"
          mapItems={subjects}
        />

        <FormFieldComponent
          control={form.control}
          name="topic"
          label="What should the companion help with?"
          type="textarea"
          placeholder="Ex. 'Derivatives & Integrals'"
        />

        <FormFieldComponent
          control={form.control}
          name="voice"
          label="Voice"
          type="select"
          placeholder="Select the voice, e.g., Friendly, Professional"
          mapItems={voiceType}
        />

        <FormFieldComponent
          control={form.control}
          name="style"
          label="Style"
          type="select"
          mapItems={voiceStyle}
          placeholder="Select the style"
        />

        <FormFieldComponent
          control={form.control}
          name="duration"
          label="Estimated session duration in minutes"
          type="number"
          placeholder="15"
        />

        <Button type="submit" className="w-full cursor-pointer">
          Build Your Companion
        </Button>
      </form>
    </Form>
  );
};

export default CompanionForm;

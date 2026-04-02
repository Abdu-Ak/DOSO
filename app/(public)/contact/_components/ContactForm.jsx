"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEnquirySchema } from "@/lib/validations/enquiry.validation";
import { Send, Phone, User, MessageSquare } from "lucide-react";
import { addToast } from "@heroui/toast";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";

const subjects = [
  "Admissions Inquiry",
  "General Information",
  "Support Our Institute",
  "Technical Issue",
];

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createEnquirySchema),
    defaultValues: {
      name: "",
      phone: "",
      subject: "Admissions Inquiry",
      message: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        addToast({
          title: "Success",
          description: "Enquiry submitted successfully!",
          color: "success",
        });
        reset();
      } else {
        addToast({
          title: "Error",
          description: result.message || "Failed to submit enquiry",
          color: "danger",
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      addToast({
        title: "Error",
        description: "An unexpected error occurred",
        color: "danger",
      });
    }
  };

  const inputClasses = {
    label: "font-bold text-slate-700 dark:text-slate-200 mb-1",
    inputWrapper: [
      "bg-slate-100/50",
      "dark:bg-slate-800/50",
      "border",
      "border-slate-200",
      "dark:border-slate-700",
      "hover:border-primary/30",
      "focus-within:!border-primary/50",
      "transition-colors",
      "shadow-none",
      "h-12",
    ].join(" "),
    input: "text-slate-800 dark:text-slate-100 text-sm",
  };

  const selectClasses = {
    label: "font-bold text-slate-700 dark:text-slate-200 mb-1",
    trigger: [
      "bg-slate-100/50",
      "dark:bg-slate-800/50",
      "border",
      "border-slate-200",
      "dark:border-slate-700",
      "hover:border-primary/30",
      "transition-colors",
      "shadow-none",
      "h-12",
    ].join(" "),
    value: "text-slate-800 dark:text-slate-100 text-sm",
  };

  return (
    <div className="bg-white dark:bg-slate-900/80 p-6 md:p-10 mosque-arch-card shadow-xl shadow-primary/5 border border-primary/10 rounded-3xl h-full">
      <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-primary dark:text-white">
        Get in Touch
      </h1>
      <p className="text-slate-500 dark:text-slate-400 mb-4 leading-relaxed font-medium text-sm">
        Have a question about our curriculum or admissions? Send us a message
        and our administrative team will respond within 24 hours.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            {...register("name")}
            label="Full Name"
            placeholder="Enter your name"
            labelPlacement="outside"
            variant="flat"
            radius="lg"
            startContent={<User size={18} className="text-primary/50" />}
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message}
            classNames={inputClasses}
          />
          <Input
            {...register("phone")}
            label="Phone Number"
            placeholder="+1 (555) 000-0000"
            labelPlacement="outside"
            variant="flat"
            radius="lg"
            startContent={<Phone size={18} className="text-primary/50" />}
            isInvalid={!!errors.phone}
            errorMessage={errors.phone?.message}
            classNames={inputClasses}
          />
        </div>

        <div className="mt-10">
          <Select
            {...register("subject")}
            label="Subject"
            placeholder="Select a subject"
            labelPlacement="outside"
            variant="flat"
            radius="lg"
            defaultSelectedKeys={["Admissions Inquiry"]}
            isInvalid={!!errors.subject}
            errorMessage={errors.subject?.message}
            classNames={selectClasses}
          >
            {subjects.map((s) => (
              <SelectItem key={s} value={s} className="font-medium">
                {s}
              </SelectItem>
            ))}
          </Select>
        </div>

        <Textarea
          {...register("message")}
          label="Message"
          placeholder="How can we help you?"
          labelPlacement="outside"
          variant="flat"
          radius="lg"
          minRows={4}
          startContent={
            <MessageSquare size={18} className="text-primary/50 mt-1" />
          }
          isInvalid={!!errors.message}
          errorMessage={errors.message?.message}
          classNames={{
            ...inputClasses,
            inputWrapper: inputClasses.inputWrapper + " h-auto py-3",
          }}
        />

        <Button
          type="submit"
          color="primary"
          size="lg"
          radius="lg"
          className="w-full font-bold shadow-lg shadow-primary/20 h-12 uppercase tracking-wide"
          startContent={!isSubmitting && <Send size={18} />}
          isLoading={isSubmitting}
        >
          Send Message
        </Button>
      </form>
    </div>
  );
}

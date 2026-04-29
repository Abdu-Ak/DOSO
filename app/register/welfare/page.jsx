"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { publicCreateWelfareSchema } from "@/lib/validations/welfare.validation";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { addToast } from "@heroui/toast";
import {
  HeartHandshake,
  Search,
  CheckCircle2,
  CheckCircle,
} from "lucide-react";
import { useDebounce } from "@/lib/hooks";

export default function PublicWelfarePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [submitted, setSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(publicCreateWelfareSchema),
    defaultValues: {
      alumni: "",
      description: "",
      amount: "",
    },
  });

  const { data: alumniData, isLoading: isAlumniLoading } = useQuery({
    queryKey: ["public-alumni-search-welfare", debouncedSearch],
    queryFn: async () => {
      const response = await axios.get("/api/users", {
        params: {
          role: "alumni",
          search: debouncedSearch,
          limit: 20,
          status: "Active",
        },
      });
      return response.data.users;
    },
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post("/api/register/welfare", data);
      return response.data;
    },
    onSuccess: () => {
      addToast({
        title: "Success",
        description:
          "Your Welfare Fund record has been submitted for approval.",
        color: "success",
      });
      setSubmitted(true);
      reset();
    },
    onError: (error) => {
      addToast({
        title: "Error",
        description: error.response?.data?.error || "Failed to submit record",
        color: "danger",
      });
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardBody className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              Submission Successful!
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your Welfare Fund contribution has been submitted and is currently
              pending administrative approval.
            </p>
            <Button
              color="primary"
              variant="shadow"
              fullWidth
              className="font-black text-white tracking-widest mt-4"
              onPress={() => setSubmitted(false)}
            >
              Submit Another Record
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-3xl space-y-8 py-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <img
            src="/doso_logo.jpeg"
            alt="DOSO Logo"
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl shadow-md object-cover"
          />
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
              Welfare Fund
            </h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Contribute to the Alumni Welfare Fund. Your contribution will be
              reviewed by an administrator.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl overflow-visible">
            <CardBody className="p-6 sm:p-8 md:p-10 space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <Controller
                  name="alumni"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      label="Alumni Name / ID"
                      placeholder="Search and select your name"
                      variant="bordered"
                      labelPlacement="outside"
                      radius="lg"
                      isLoading={isAlumniLoading}
                      onInputChange={setSearchTerm}
                      selectedKey={field.value}
                      onSelectionChange={field.onChange}
                      isInvalid={!!errors.alumni}
                      errorMessage={errors.alumni?.message}
                      fullWidth
                    >
                      {(alumniData || []).map((u) => (
                        <AutocompleteItem key={u._id} textValue={u.name}>
                          <div className="flex flex-col">
                            <span className="font-bold">{u.name}</span>
                            <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
                              {u.userId}
                            </span>
                          </div>
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  )}
                />

                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      label="Description"
                      placeholder="What is this contribution for?"
                      variant="bordered"
                      labelPlacement="outside"
                      radius="lg"
                      isInvalid={!!errors.description}
                      errorMessage={errors.description?.message}
                      minRows={3}
                    />
                  )}
                />

                <Controller
                  name="amount"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Amount (₹)"
                      placeholder="0.00"
                      type="number"
                      variant="bordered"
                      labelPlacement="outside"
                      radius="lg"
                      isInvalid={!!errors.amount}
                      errorMessage={errors.amount?.message}
                      startContent={
                        <span className="text-slate-400 text-sm">₹</span>
                      }
                    />
                  )}
                />
              </div>

              <div className="mt-5 flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  type="submit"
                  color="primary"
                  variant="shadow"
                  className="w-full sm:w-auto px-12 font-bold shadow-lg h-12"
                  radius="lg"
                  size="lg"
                  isLoading={mutation.isPending}
                  startContent={
                    !mutation.isPending && <CheckCircle2 size={20} />
                  }
                >
                  Submit Contribution
                </Button>
              </div>
            </CardBody>
          </Card>
        </form>
      </div>
    </div>
  );
}

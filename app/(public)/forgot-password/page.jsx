"use client";

import React, { useState } from "react";
import {
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { forgotPasswordSchema } from "@/lib/validations/auth.validation";
import { useAuth } from "../_hooks/useAuth";

const ForgotPasswordPage = () => {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { forgotPasswordMutation } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await forgotPasswordMutation.mutateAsync(data.email);
      if (response.success) {
        setIsEmailSent(true);
      }
    } catch (err) {
      // Error is handled by the hook's Toast
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-background-light dark:bg-background-dark bg-islamic-pattern py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Ornaments */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -ml-32 -mb-32"></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-serif">
            Forgot Password
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 mosque-arch-card">
          {isEmailSent ? (
            <div className="text-center space-y-6 py-4 animate-in zoom-in-95 fade-in duration-300">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center text-success">
                  <CheckCircle2 size={32} />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Email Sent!
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  If an account exists with that email, a reset link has been
                  sent. Please check your inbox.
                </p>
              </div>
              <Button
                as={Link}
                href="/login"
                variant="flat"
                color="primary"
                className="w-full font-bold h-12 rounded-xl"
                startContent={<ChevronLeft size={18} />}
              >
                Back to Login
              </Button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <Input
                  {...register("email")}
                  label="Email Address"
                  placeholder="Enter your registered email"
                  labelPlacement="outside"
                  type="email"
                  variant="bordered"
                  radius="lg"
                  size="lg"
                  isInvalid={!!errors.email}
                  errorMessage={errors.email?.message}
                  startContent={<Mail size={18} className="text-slate-400" />}
                  classNames={{
                    label: "text-slate-700 dark:text-slate-300 font-medium",
                    inputWrapper:
                      "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus-within:!border-primary",
                  }}
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  isLoading={forgotPasswordMutation.isPending}
                  color="primary"
                  className="w-full h-12 rounded-xl font-bold text-md shadow-lg shadow-primary/25"
                  endContent={
                    !forgotPasswordMutation.isPending && (
                      <ArrowRight size={18} />
                    )
                  }
                >
                  {forgotPasswordMutation.isPending
                    ? "Sending link..."
                    : "Send Reset Link"}
                </Button>
              </div>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-500 hover:text-primary transition-colors flex items-center justify-center gap-1"
                >
                  <ChevronLeft size={16} />
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-500 uppercase tracking-widest">
          © {new Date().getFullYear()} Darul Hidaya Dars. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

"use client";

import React, { useState, Suspense } from "react";
import {
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { resetPasswordSchema } from "@/lib/validations/auth.validation";
import { useAuth } from "../_hooks/useAuth";

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const { resetPasswordMutation } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await resetPasswordMutation.mutateAsync({
        ...data,
        token,
      });
      if (response.success) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (err) {
      // Error handled by hook's Toast
    }
  };

  if (!token && !isSuccess) {
    return (
      <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 mosque-arch-card">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <AlertCircle className="text-danger" size={48} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Invalid Request
          </h3>
          <p className="text-sm text-slate-500">
            The reset token is missing or invalid. Please request a new password
            reset link.
          </p>
          <Button
            as={Link}
            href="/forgot-password"
            variant="flat"
            color="primary"
            className="mt-4 rounded-xl"
          >
            Request New Link
          </Button>
        </div>
      </div>
    );
  }

  console.log(errors, "errors");

  return (
    <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 mosque-arch-card">
      {isSuccess ? (
        <div className="text-center space-y-6 py-4 animate-in zoom-in-95 fade-in duration-300">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center text-success">
              <CheckCircle2 size={32} />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Password Updated!
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Your password has been successfully reset. Redirecting to login...
            </p>
          </div>
          <Loader2 className="animate-spin mx-auto text-primary" size={24} />
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register("password")}
            label="New Password"
            placeholder="••••••••"
            labelPlacement="outside"
            type={showPassword ? "text" : "password"}
            variant="bordered"
            radius="lg"
            size="lg"
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
            startContent={<Lock size={18} className="text-slate-400" />}
            endContent={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={18} className="text-slate-400" />
                ) : (
                  <Eye size={18} className="text-slate-400" />
                )}
              </button>
            }
            classNames={{
              label: "text-slate-700 dark:text-slate-300 font-medium",
              inputWrapper:
                "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus-within:!border-primary",
            }}
          />

          <div className="mt-10">
            <Input
              {...register("confirmPassword")}
              label="Confirm New Password"
              placeholder="••••••••"
              labelPlacement="outside"
              type={showPassword ? "text" : "password"}
              variant="bordered"
              radius="lg"
              size="lg"
              isInvalid={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword?.message}
              startContent={
                <ShieldCheck size={18} className="text-slate-400" />
              }
              classNames={{
                label: "text-slate-700 dark:text-slate-300 font-medium",
                inputWrapper:
                  "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus-within:!border-primary",
              }}
            />
          </div>

          <Button
            type="submit"
            isLoading={resetPasswordMutation.isPending}
            color="primary"
            className="w-full h-12 rounded-xl font-bold text-md shadow-lg shadow-primary/25"
            endContent={
              !resetPasswordMutation.isPending && <ArrowRight size={18} />
            }
          >
            {resetPasswordMutation.isPending
              ? "Updating..."
              : "Update Password"}
          </Button>
        </form>
      )}
    </div>
  );
};

const ResetPasswordPage = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-background-light dark:bg-background-dark bg-islamic-pattern py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Ornaments */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -ml-32 -mb-32"></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-serif">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Please enter your new password below.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="flex justify-center p-12 bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>

        {/* Footer info */}
        <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-500 uppercase tracking-widest">
          © {new Date().getFullYear()} Darul Hidaya Dars. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

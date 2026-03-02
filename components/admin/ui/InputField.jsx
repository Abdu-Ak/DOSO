"use client";

import React, { useState } from "react";
import { Input } from "@heroui/input";
import { Eye, EyeOff } from "lucide-react";

/**
 * Reusable InputField component that standardizes:
 * - Label with required indicator (*)
 * - Validation error messages
 * - Password visibility toggle
 * - Common styling (bordered variant, sm radius)
 */
const InputField = React.forwardRef(
  (
    {
      label,
      placeholder,
      type = "text",
      required = true,
      error,
      startContent,
      isEdit = false,
      isClearable = true,
      ...props
    },
    ref,
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const isPassword = type === "password";
    const actualType = isPassword ? (isVisible ? "text" : "password") : type;

    return (
      <div className="space-y-1">
        <Input
          ref={ref}
          {...props}
          type={actualType}
          label={
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {label} {required && <span className="text-red-500">*</span>}
              </span>
              {isPassword && isEdit && (
                <span className="text-xs font-normal text-slate-400">
                  (Leave blank to keep current)
                </span>
              )}
            </div>
          }
          labelPlacement="outside"
          placeholder={placeholder}
          variant="bordered"
          radius="sm"
          startContent={startContent}
          isInvalid={!!error}
          errorMessage={error?.message}
          isClearable={!isPassword && isClearable}
          endContent={
            isPassword ? (
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <Eye className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            ) : null
          }
        />
      </div>
    );
  },
);

InputField.displayName = "InputField";

export default InputField;

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useForm, Controller } from "react-hook-form";
import { CircleX } from "lucide-react";

export default function RenewMembershipModal({
  isOpen,
  onOpenChange,
  onConfirm,
  currentYear,
}) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      receipt_number: "",
    },
  });

  const year = currentYear || new Date().getFullYear();

  const onSubmit = (data) => {
    onConfirm({ ...data, year });
    reset();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="md"
      hideCloseButton
      isDismissable={false}
    >
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex items-center justify-between gap-3">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                  Renew Membership
                </h3>
                <p className="text-sm text-slate-600 font-normal dark:text-slate-400 -mt-2">
                  Enter the receipt number for the renewal year{" "}
                  <strong>{year}</strong>.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-6 h-6 flex items-center justify-center text-red-600 hover:bg-red-400 rounded-full hover:text-white transition-all duration-200"
                aria-label="Close"
              >
                <CircleX size={22} />
              </button>
            </ModalHeader>

            <ModalBody className="py-4">
              <Controller
                name="receipt_number"
                control={control}
                rules={{ required: "Receipt number is required" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Receipt Number"
                    labelPlacement="outside"
                    placeholder="REC-XXXXX"
                    variant="bordered"
                    radius="sm"
                    isInvalid={!!errors.receipt_number}
                    errorMessage={errors.receipt_number?.message}
                    isRequired
                    className="mt-2"
                  />
                )}
              />
            </ModalBody>

            <ModalFooter className="border-t border-slate-100 dark:border-slate-800 py-6">
              <Button
                color="primary"
                fullWidth
                type="submit"
                className="font-bold text-white h-12 rounded-lg"
              >
                Confirm Renewal
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}

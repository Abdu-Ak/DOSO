"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { CircleX } from "lucide-react";

export default function CreateRecordModal({
  isOpen,
  onOpenChange,
  alumniList = [],
  formData,
  setFormData,
  onSubmit,
  isLoading,
}) {
  const isFormValid =
    formData.alumni &&
    formData.amount &&
    formData.description &&
    formData.receipt_number;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="xl"
      hideCloseButton
      isDismissable={false}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-body! font-semibold text-slate-800 dark:text-white">
                  Create Welfare Record
                </h3>
                <p className="text-sm text-slate-600 font-normal dark:text-slate-400 -mt-2">
                  Create and auto-approve a record for an alumni.
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-6 h-6 flex items-center justify-center text-red-600 hover:bg-red-400 rounded-full hover:text-white transition-all duration-200"
                aria-label="Close"
              >
                <CircleX size={22} />
              </button>
            </ModalHeader>
            <ModalBody className="space-y-2">
              <Autocomplete
                label="Select Alumni"
                labelPlacement="outside"
                placeholder="Choose an alumni"
                variant="bordered"
                radius="sm"
                selectedKey={formData.alumni || null}
                onSelectionChange={(key) =>
                  setFormData({ ...formData, alumni: key })
                }
              >
                {(alumniList || []).map((u) => (
                  <AutocompleteItem
                    key={u._id}
                    textValue={`${u.name} (@${u.userId})`}
                  >
                    <div className="flex flex-col">
                      <span className="font-bold">{u.name}</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        @{u.userId}
                      </span>
                    </div>
                  </AutocompleteItem>
                ))}
              </Autocomplete>

              <div className="grid grid-cols-1 gap-4">
                <Textarea
                  label="Description"
                  placeholder="Welfare fund description"
                  variant="bordered"
                  labelPlacement="outside"
                  radius="sm"
                  minRows={2}
                  value={formData.description}
                  onValueChange={(val) =>
                    setFormData({ ...formData, description: val })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Amount (₹)"
                  placeholder="0.00"
                  type="number"
                  variant="bordered"
                  labelPlacement="outside"
                  radius="sm"
                  value={formData.amount}
                  onValueChange={(val) =>
                    setFormData({ ...formData, amount: val })
                  }
                />
                <Input
                  label="Receipt Number"
                  placeholder="Enter receipt number"
                  variant="bordered"
                  labelPlacement="outside"
                  radius="sm"
                  value={formData.receipt_number}
                  onValueChange={(val) =>
                    setFormData({ ...formData, receipt_number: val })
                  }
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                fullWidth
                onPress={onSubmit}
                isLoading={isLoading}
                isDisabled={!isFormValid}
                className="font-bold text-white h-12 rounded-lg"
              >
                Create & Approve
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

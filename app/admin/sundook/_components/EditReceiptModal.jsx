"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { CircleX } from "lucide-react";

export default function EditReceiptModal({
  isOpen,
  onOpenChange,
  record,
  onSave,
  isLoading,
}) {
  const [receiptNumber, setReceiptNumber] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (record) {
      setReceiptNumber(record.receipt_number || record.receipt_no || "");
      setErrorMsg("");
    }
  }, [record, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!receiptNumber.trim()) {
      setErrorMsg("Receipt number is required");
      return;
    }

    try {
      await onSave(receiptNumber.trim());
      setErrorMsg("");
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || "Failed to update receipt";
      setErrorMsg(msg);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton>
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit}>
            <ModalHeader className="flex items-center justify-between gap-3">
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                  Edit Receipt Number
                </h3>
                <p className="text-xs text-slate-500 font-normal">
                  Update receipt number for {record?.alumni?.name || record?.requester?.name || "record"}
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
            <ModalBody>
              <Input
                label="Receipt Number"
                labelPlacement="outside"
                variant="bordered"
                placeholder="REC-XXXXX"
                value={receiptNumber}
                onChange={(e) => {
                  setReceiptNumber(e.target.value);
                  setErrorMsg("");
                }}
                radius="sm"
                isInvalid={!!errorMsg}
                errorMessage={errorMsg}
                isRequired
                className="mt-2"
              />
            </ModalBody>
            <ModalFooter className="border-t border-slate-100 dark:border-slate-800 py-4">
              <Button
                color="primary"
                type="submit"
                isLoading={isLoading}
                isDisabled={!receiptNumber.trim()}
                className="font-bold text-white h-11 rounded-lg w-full"
              >
                Save Receipt Number
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}

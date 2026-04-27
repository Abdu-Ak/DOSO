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
import { Input } from "@heroui/input";
import { CheckCircle2, CircleX } from "lucide-react";

export default function ApproveModal({
  isOpen,
  onOpenChange,
  record,
  receiptNumber,
  setReceiptNumber,
  onApprove,
  isLoading,
}) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-body! font-semibold text-slate-800 dark:text-white">
                Approve Contribution
              </h3>
              <button
                onClick={onClose}
                className="w-6 h-6 flex items-center justify-center text-red-600 hover:bg-red-400 rounded-full hover:text-white transition-all duration-200"
                aria-label="Close"
              >
                <CircleX size={22} />
              </button>
            </ModalHeader>
            <ModalBody>
              <p className="text-slate-600 dark:text-slate-400">
                You are about to approve the welfare fund from{" "}
                <strong className="text-slate-900 dark:text-white">
                  {record?.alumni?.name}
                </strong>{" "}
                for <strong>{record?.description}</strong>.
              </p>
              <div className="mt-4">
                <Input
                  label="Receipt Number"
                  placeholder="Enter receipt number"
                  variant="bordered"
                  labelPlacement="outside"
                  radius="lg"
                  value={receiptNumber}
                  onValueChange={setReceiptNumber}
                  isRequired
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="success"
                fullWidth
                onPress={onApprove}
                isDisabled={!receiptNumber.trim()}
                isLoading={isLoading}
                className="font-bold text-white h-12 rounded-lg w-fit"
              >
                Approve & Notify
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

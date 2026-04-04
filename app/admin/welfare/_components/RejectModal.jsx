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
import { Textarea } from "@heroui/input";
import { XCircle, CircleX } from "lucide-react";

export default function RejectModal({
  isOpen,
  onOpenChange,
  record,
  rejectionReason,
  setRejectionReason,
  onReject,
  isLoading,
}) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center justify-between">
              <h3 className="text-lg font-body! font-semibold text-slate-800 dark:text-white">
                Reject Contribution
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
                Please provide a reason for rejecting the welfare fund from{" "}
                <strong className="text-slate-900 dark:text-white">
                  {record?.alumni?.name}
                </strong>{" "}
                for <strong>{record?.description}</strong>.
              </p>
              <div className="mt-4">
                <Textarea
                  label="Rejection Reason"
                  placeholder="Enter reason for rejection"
                  variant="bordered"
                  labelPlacement="outside"
                  radius="lg"
                  value={rejectionReason}
                  onValueChange={setRejectionReason}
                  isRequired
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                fullWidth
                onPress={onReject}
                isDisabled={!rejectionReason.trim()}
                isLoading={isLoading}
                className="font-bold h-12 rounded-lg w-fit"
              >
                Reject & Notify
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

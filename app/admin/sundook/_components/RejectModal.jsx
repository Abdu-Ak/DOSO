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
import { CircleX } from "lucide-react";

const RejectModal = ({
  isOpen,
  onOpenChange,
  record,
  rejectionReason,
  setRejectionReason,
  onReject,
  isLoading,
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-body! font-semibold text-slate-800 dark:text-white">
                Reject Submission
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
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                Rejecting record for <strong>{record?.alumni?.name}</strong>.
                Provide a reason:
              </p>
              <Input
                variant="bordered"
                placeholder="Rejection reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                radius="sm"
              />
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                fullWidth
                onPress={onReject}
                isDisabled={!rejectionReason}
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
};

export default RejectModal;

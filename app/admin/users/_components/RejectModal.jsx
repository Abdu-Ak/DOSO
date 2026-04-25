"use client";

import React, { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { CircleX } from "lucide-react";

/**
 * Standardized RejectModal for User & Student Management
 */
const RejectModal = ({ user, onClose, onReject, isLoading, type = "User" }) => {
  const [reason, setReason] = useState("");

  const isStudent = type?.toLowerCase() === "student";
  const isRequired = !isStudent; // Required for all except students

  const handleReject = () => {
    onReject({ id: user._id, reason });
    setReason("");
  };

  return (
    <Modal isOpen={!!user} onClose={onClose} hideCloseButton>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-body! font-semibold text-slate-800 dark:text-white">
                Reject Registration
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
                Rejecting <strong>{user?.name}</strong>. Provide a reason
                {!isRequired && "(optional)"}:
              </p>
              <Input
                variant="bordered"
                placeholder="Rejection reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                radius="sm"
              />
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                fullWidth
                className="font-bold h-12 rounded-lg shadow-lg shadow-danger/20"
                isLoading={isLoading}
                isDisabled={isRequired && !reason}
                onPress={handleReject}
              >
                Reject {type}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default RejectModal;

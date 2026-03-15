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

const RejectModal = ({ user, onClose, onReject, isLoading }) => {
  const [reason, setReason] = useState("");

  const handleReject = () => {
    onReject({ id: user._id, reason });
    setReason("");
  };

  return (
    <Modal isOpen={!!user} onClose={onClose} hideCloseButton>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <h3 className="text-lg font-body! font-semibold text-slate-800 dark:text-white">
                Reject Registration
              </h3>
            </ModalHeader>
            <ModalBody>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                Rejecting <strong>{user?.name}</strong>. Provide a reason
                (optional):
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
              <Button variant="light" onPress={onClose} className="font-bold">
                Cancel
              </Button>
              <Button
                color="danger"
                className="font-bold"
                isLoading={isLoading}
                onPress={handleReject}
              >
                Reject
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default RejectModal;

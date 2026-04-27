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
import { CircleX, UserCheck, AlertCircle, MessageSquare } from "lucide-react";

export default function WitnessActionModal({
  isOpen,
  onOpenChange,
  actionData,
  setActionData,
  onConfirm,
  isLoading,
}) {
  const { status, reason } = actionData;
  const isRejection = status === "rejected";

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      size="md"
      hideCloseButton
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                {isRejection ? (
                  <>
                    <AlertCircle className="text-danger" size={20} />
                    Reject Dept Request
                  </>
                ) : (
                  <>
                    <UserCheck className="text-success" size={20} />
                    Confirm Witness Approval
                  </>
                )}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="w-6 h-6 flex items-center justify-center text-red-600 hover:bg-red-400 rounded-full hover:text-white transition-all duration-200"
              >
                <CircleX size={20} />
              </button>
            </ModalHeader>
            <ModalBody className="py-4 space-y-4">
              <p className="text-sm font-medium text-slate-500">
                {isRejection
                  ? "Are you sure you want to reject this debt request? Please provide a reason for the requester."
                  : "By approving, you verify that you know the requester and vouch for their credibility in this debt request."}
              </p>

              {isRejection && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <MessageSquare size={12} />
                    Rejection Reason
                  </label>
                  <Input
                    placeholder="Enter rejection reason..."
                    variant="bordered"
                    value={reason}
                    onValueChange={(val) =>
                      setActionData((prev) => ({ ...prev, reason: val }))
                    }
                    radius="lg"
                    className="font-medium"
                    autoFocus
                  />
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                color={isRejection ? "danger" : "success"}
                onPress={onConfirm}
                isLoading={isLoading}
                isDisabled={isRejection && !reason.trim()}
                className="font-black text-white shadow-lg px-8"
                radius="lg"
              >
                {isRejection ? "Confirm Rejection" : "Confirm Approval"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

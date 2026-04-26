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
import { XCircle, CircleX, User } from "lucide-react";

export default function RejectDebtModal({
  isOpen,
  onOpenChange,
  record,
  rejectionReason,
  setRejectionReason,
  onReject,
  isLoading,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton
      className="max-w-md"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-body! font-semibold text-slate-800 dark:text-white">
                Reject Debt Request
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
              <div className="p-4 bg-danger/5 border border-danger/10 rounded-2xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center">
                    <User className="text-danger" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 dark:text-white">
                      {record?.requester?.name}
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                      {record?.requester?.userId}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-danger/10">
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    Amount
                  </span>
                  <span className="text-lg font-black text-danger">
                    ₹{record?.amount?.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-4 py-2">
                <p className="text-sm text-slate-500 font-medium mb-1">
                  Please provide a reason for rejecting this debt application.
                </p>
                <Input
                  //   label="Rejection Reason"
                  placeholder="Enter reason..."
                  variant="bordered"
                  value={rejectionReason}
                  onValueChange={setRejectionReason}
                  labelPlacement="outside"
                  radius="lg"
                  autoFocus
                  isRequired
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                className="font-bold text-white shadow-lg shadow-danger/20 h-12 px-8"
                startContent={<XCircle size={18} />}
                onPress={onReject}
                isLoading={isLoading}
                isDisabled={!rejectionReason.trim()}
              >
                Reject Request
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

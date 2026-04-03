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
import { CircleX, X } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmation",
  message,
  confirmText = "Delete",
  isLoading = false,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hideCloseButton
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: 20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center justify-between">
              <h3 className="text-lg font-body! font-semibold text-slate-800 dark:text-white">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="w-6 h-6 flex items-center justify-center text-red-600  hover:bg-red-400 rounded-full hover:text-white transition-all duration-200"
                aria-label="Close"
              >
                <CircleX size={22} />
              </button>
            </ModalHeader>
            <ModalBody>
              <h4 className="text-base font-body! font-medium text-slate-700 dark:text-slate-200 mb-4">
                Are you sure?
              </h4>
              <div className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                {message}
              </div>
            </ModalBody>
            <ModalFooter className="flex justify-end pt-0">
              <Button
                color="danger"
                onPress={onConfirm}
                isLoading={isLoading}
                className="font-bold rounded-lg shadow-lg shadow-danger/20 px-8 h-10 text-md bg-red-600 hover:bg-red-700"
              >
                {confirmText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

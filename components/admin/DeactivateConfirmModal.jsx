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
import { CircleX } from "lucide-react";

/**
 * Standardized DeactivateConfirmModal matching project-wide modal standards
 */
const DeactivateConfirmModal = ({ isOpen, onOpenChange, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-body! font-semibold text-slate-800 dark:text-white">
                Confirm Deactivation
              </h3>
              <button
                onClick={onClose}
                className="w-6 h-6 flex items-center justify-center text-red-600 hover:bg-red-400 rounded-full hover:text-white transition-all duration-200"
                aria-label="Close"
              >
                <CircleX size={22} />
              </button>
            </ModalHeader>
            <ModalBody className="text-center px-8 pb-8 pt-6">
              <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center text-danger mb-4 mx-auto">
                <span className="text-3xl font-black">!</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                By making your profile{" "}
                <span className="text-danger font-black">Inactive</span>, you
                will be automatically{" "}
                <span className="font-black">logged out</span> and will no
                longer be able to access the dashboard.
              </p>
              <p className="text-slate-500 dark:text-slate-500 text-sm mt-4 font-bold">
                Are you absolutely sure you want to proceed?
              </p>
            </ModalBody>
            <ModalFooter className="pb-8 pt-0 px-8">
              <Button
                color="danger"
                fullWidth
                onPress={() => {
                  onConfirm();
                  onClose();
                }}
                className="font-black h-12 rounded-lg shadow-lg shadow-danger/25"
                size="lg"
              >
                Confirm & Logout
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DeactivateConfirmModal;

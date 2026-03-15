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

const DeactivateConfirmModal = ({ isOpen, onOpenChange, onConfirm }) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      placement="center"
      className="dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 items-center justify-center pt-8">
              <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center text-danger mb-4">
                <span className="text-3xl font-black">!</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Confirm Deactivation
              </h2>
            </ModalHeader>
            <ModalBody className="text-center px-8 pb-8">
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
            <ModalFooter className="flex gap-3 justify-center pb-8 pt-0">
              <Button
                variant="flat"
                onPress={onClose}
                className="font-bold text-slate-600 dark:text-slate-400"
                size="lg"
              >
                Cancel
              </Button>
              <Button
                color="danger"
                onPress={() => {
                  onConfirm();
                  onClose();
                }}
                className="px-8 font-black shadow-lg shadow-danger/25"
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

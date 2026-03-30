"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import {
  Image as ImageIcon,
  Video,
  Download,
  X,
  Play,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ScrollShadow } from "@heroui/scroll-shadow";

export default function ViewGalleryModal({ isOpen, onClose, event }) {
  const [selectedMedia, setSelectedMedia] = useState(null);

  if (!event) return null;

  const galleryImages = event.galleryImages || [];
  const galleryVideos = event.galleryVideos || [];
  const allMedia = [
    ...galleryImages.map((url) => ({ url, type: "image" })),
    ...galleryVideos.map((url) => ({ url, type: "video" })),
  ];

  const handleDownload = (url, name) => {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.download = name || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openPreview = (item) => {
    setSelectedMedia(item);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onClose}
        size="5xl"
        scrollBehavior="inside"
        backdrop="blur"
        hideCloseButton
      >
        <ModalContent className="rounded-3xl">
          <ModalHeader className="flex flex-col gap-1 border-b border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">
                  {event.title}
                </h2>
                <p className="text-sm font-medium text-gray-400">
                  Event Gallery • {allMedia.length} Items
                </p>
              </div>
            </div>
          </ModalHeader>
          <ModalBody className="p-8">
            {allMedia.length > 0 ? (
              <ScrollShadow className="w-full">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {allMedia.map((item, index) => (
                    <div
                      key={index}
                      className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 bg-gray-50 border border-gray-100"
                      onClick={() => openPreview(item)}
                    >
                      {item.type === "image" ? (
                        <img
                          src={item.url}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          alt="Gallery item"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-900 group-hover:bg-gray-800 transition-colors">
                          <div className="p-4 bg-primary/20 rounded-full text-primary group-hover:scale-125 transition-transform duration-300">
                            <Play fill="currentColor" size={24} />
                          </div>
                          <div className="absolute top-2 left-2 p-1.5 bg-black/40 rounded-lg text-white">
                            <Video size={14} />
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          className="bg-white/20 text-white backdrop-blur-md border border-white/30 rounded-xl"
                          onPress={() => openPreview(item)}
                        >
                          {item.type === "image" ? (
                            <ImageIcon size={18} />
                          ) : (
                            <Play size={18} />
                          )}
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          className="bg-primary/80 text-white border border-white/20 rounded-xl font-bold"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(item.url, `event-media-${index}`);
                          }}
                        >
                          <Download size={18} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollShadow>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
                <div className="p-6 bg-gray-50 rounded-full">
                  <ImageIcon size={48} className="opacity-20" />
                </div>
                <p className="font-medium">
                  No media available in this gallery
                </p>
              </div>
            )}
          </ModalBody>
          <ModalFooter className="border-t border-gray-100">
            <Button
              color="danger"
              variant="light"
              className="font-bold"
              onPress={onClose}
            >
              Close Gallery
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Fullscreen Preview Modal */}
      <Modal
        isOpen={!!selectedMedia}
        onOpenChange={() => setSelectedMedia(null)}
        size="full"
        hideCloseButton
        className="bg-black/95 z-999"
      >
        <ModalContent>
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-12 gap-6 group">
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-6 right-6 z-50 p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl backdrop-blur-xl transition-all"
            >
              <X size={24} />
            </button>

            {selectedMedia?.type === "image" ? (
              <img
                src={selectedMedia.url}
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
                alt="Preview"
              />
            ) : (
              <video
                src={selectedMedia?.url}
                controls
                className="max-w-full max-h-[85vh] rounded-xl shadow-2xl"
                autoPlay
              />
            )}

            <div className="flex items-center gap-4">
              <Button
                color="primary"
                startContent={<Download size={18} />}
                onPress={() => handleDownload(selectedMedia.url)}
                className="font-bold px-8 h-12 rounded-2xl shadow-xl shadow-primary/30"
              >
                Download {selectedMedia?.type === "image" ? "Image" : "Video"}
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}

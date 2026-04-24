import { Mail, Phone, MapPin } from "lucide-react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { Avatar } from "@heroui/avatar";

export default function AlumniModal({ isOpen, onClose, alumni }) {
  if (!alumni) return null;

  const {
    name,
    batch,
    current_job,
    custom_job,
    education,
    house_name,
    address,
    district,
    custom_district,
    post_office,
    pincode,
    image,
    email,
    phone,
    dob,
    father_name,
    job_location,
  } = alumni;

  const formattedAddress = [
    house_name,
    address,
    district === "Other" ? custom_district : district,
    post_office,
    pincode,
  ]
    .filter(Boolean)
    .join(", ");

  const occupation =
    current_job === "Other" ? custom_job : current_job || "Alumni";

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="xl"
      scrollBehavior="inside"
      // backdrop="blur"
      classNames={{
        // backdrop: "bg-slate-900/10 backdrop-blur-sm shadow-none",
        base: "bg-white dark:bg-slate-950 max-h-[80vh] md:max-h-[96vh]",
        header: "border-0 pb-0",
        body: "px-8 pb-10 pt-4",
        closeButton: "top-6 right-6 hover:bg-slate-100 dark:hover:bg-slate-800",
      }}
    >
      <ModalContent className="rounded-3xl">
        {(onClose) => (
          <>
            <ModalBody className="space-y-3">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <Avatar
                  src={image}
                  name={name}
                  className="w-24 h-24 text-2xl font-black shadow-lg border-4 border-slate-50 dark:border-slate-900"
                  radius="full"
                  color="primary"
                />
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white capitalize leading-tight">
                    {name}
                  </h2>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-4 pt-1">
                    <p className="text-primary font-black text-[10px] uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                      Batch of {batch}
                    </p>
                    {/* {occupation && (
                      <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                        {occupation}
                      </p>
                    )} */}
                  </div>
                </div>
              </div>

              {/* Sections Container */}
              <div className="space-y-6 pt-4">
                {/* Simplified Contact & Location Info */}
                <div className="grid grid-cols-1 gap-6 px-1">
                  {formattedAddress && (
                    <div className="flex items-start gap-3">
                      <div className="mt-2 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                        <MapPin size={16} />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Place
                        </span>
                        <p className="text-slate-900 dark:text-white font-bold text-sm leading-tight">
                          {formattedAddress}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {email && (
                      <div className="flex items-start gap-3">
                        <div className="mt-2 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                          <Mail size={16} />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Email Address
                          </span>
                          <p className="text-slate-900 dark:text-white font-bold text-sm leading-tight break-all">
                            {email}
                          </p>
                        </div>
                      </div>
                    )}
                    {phone && (
                      <div className="flex items-start gap-3">
                        <div className="mt-2 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                          <Phone size={16} />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Phone Number
                          </span>
                          <p className="text-slate-900 dark:text-white font-bold text-sm leading-tight">
                            {phone}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

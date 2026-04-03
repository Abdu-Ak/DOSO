import React from "react";
import {
  Mail,
  Phone,
  Calendar,
  MapPin,
  Home,
  Briefcase,
  Users as UsersIcon,
  GraduationCap,
  MapPinned,
  MailboxIcon,
  ScrollText,
  User as UserIcon,
} from "lucide-react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { Avatar } from "@heroui/avatar";
import { Divider } from "@heroui/divider";

const DetailItem = ({ icon: Icon, label, value, color = "primary" }) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
      {Icon && <Icon size={14} className={`text-${color}`} />}
      <span className="text-[10px] font-black uppercase tracking-widest">
        {label}
      </span>
    </div>
    <p className="text-slate-900 dark:text-white font-bold text-sm leading-tight break-words pl-5.5">
      {value || "—"}
    </p>
  </div>
);

const Section = ({ title, icon: Icon, children }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
        {Icon && <Icon size={16} />}
      </div>
      <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
        {title}
      </h3>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 px-1 pb-2">
      {children}
    </div>
  </div>
);

export default function AlumniModal({ isOpen, onClose, alumni }) {
  if (!alumni) return null;

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

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
  } = alumni;

  const occupation =
    current_job === "Other" ? custom_job : current_job || "Alumni";
  const displayDistrict = district === "Other" ? custom_district : district;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="2xl"
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
                    {occupation && (
                      <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                        {occupation}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Sections Container */}
              <div className="space-y-3">
                {/* Personal & Contact Details */}
                <Section title="Personal & Contact Information" icon={UserIcon}>
                  <DetailItem icon={Mail} label="Email Address" value={email} />
                  <DetailItem icon={Phone} label="Phone Number" value={phone} />
                  <DetailItem
                    icon={Calendar}
                    label="Date of Birth"
                    value={formatDate(dob)}
                  />
                  {father_name && (
                    <DetailItem
                      icon={UsersIcon}
                      label="Father's Name"
                      value={father_name}
                    />
                  )}
                  <DetailItem
                    icon={ScrollText}
                    label="Education"
                    value={education}
                  />
                </Section>

                {/* Address Info */}
                {(address || district || house_name) && (
                  <Section title="Address Details" icon={MapPin}>
                    {house_name && (
                      <div className="sm:col-span-2">
                        <DetailItem
                          icon={Home}
                          label="House Name"
                          value={house_name}
                        />
                      </div>
                    )}
                    {address && (
                      <div className="sm:col-row-span-2">
                        <DetailItem
                          icon={MapPin}
                          label="Full Address"
                          value={address}
                        />
                      </div>
                    )}
                    <DetailItem
                      icon={MapPinned}
                      label="District"
                      value={displayDistrict}
                    />
                    <DetailItem
                      icon={MailboxIcon}
                      label="Post Office"
                      value={post_office}
                    />
                    <DetailItem icon={MapPin} label="Pincode" value={pincode} />
                  </Section>
                )}
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

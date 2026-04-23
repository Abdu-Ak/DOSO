"use client";

import React from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Mail, MapPin, Save, X } from "lucide-react";
import LeaderEditCard from "./LeaderEditCard";

const EditForm = ({
  handleSubmit,
  onSubmit,
  register,
  errors,
  previews,
  handleImageChange,
  updateMutation,
  handleCancel,
}) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <LeaderEditCard
            role="president"
            title="President Configuration"
            errors={errors}
            register={register}
            previews={previews}
            handleImageChange={handleImageChange}
          />
          <LeaderEditCard
            role="secretary"
            title="General Secretary Configuration"
            errors={errors}
            register={register}
            previews={previews}
            handleImageChange={handleImageChange}
          />
          <LeaderEditCard
            role="treasurer"
            title="Treasurer Configuration"
            errors={errors}
            register={register}
            previews={previews}
            handleImageChange={handleImageChange}
          />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="shadow-sm border border-slate-200 dark:border-slate-800">
            <CardHeader className="flex gap-2.5 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <p className="font-bold text-sm uppercase tracking-wider text-slate-900 dark:text-white">
                Contact Info:
              </p>
            </CardHeader>
            <CardBody className="p-5 space-y-4">
              <Input
                {...register("contact.email")}
                label="Operations Email"
                labelPlacement="outside"
                placeholder="info@institution.org"
                variant="bordered"
                isInvalid={!!errors.contact?.email}
                errorMessage={errors.contact?.email?.message}
              />
              <Input
                {...register("contact.phone")}
                label="Primary Contact Line"
                labelPlacement="outside"
                placeholder="+1 (234) 567-8900"
                variant="bordered"
                isInvalid={!!errors.contact?.phone}
                errorMessage={errors.contact?.phone?.message}
              />
              <Input
                {...register("contact.address")}
                label="Mailing Address"
                labelPlacement="outside"
                placeholder="Physical location"
                variant="bordered"
                isInvalid={!!errors.contact?.address}
                errorMessage={errors.contact?.address?.message}
              />
              <Input
                {...register("contact.mapLink")}
                label="Google Maps URL"
                labelPlacement="outside"
                placeholder="https://maps.google.com/..."
                variant="bordered"
                isInvalid={!!errors.contact?.mapLink}
                errorMessage={errors.contact?.mapLink?.message}
                startContent={<MapPin size={14} className="text-slate-400" />}
              />
            </CardBody>
          </Card>

          {/* Actions Section */}
          <div className="flex flex-col gap-3">
            <Button
              color="primary"
              type="submit"
              isLoading={updateMutation.isPending}
              className="w-full font-bold h-11"
              radius="lg"
              startContent={!updateMutation.isPending && <Save size={18} />}
            >
              Save Changes
            </Button>
            <Button
              variant="flat"
              type="button"
              onPress={handleCancel}
              className="w-full font-bold h-11"
              radius="lg"
              startContent={<X size={18} />}
              isDisabled={updateMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditForm;

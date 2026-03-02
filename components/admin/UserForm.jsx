import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "@/lib/validations/userSchema";
import { Camera, X, Save } from "lucide-react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { RadioGroup, Radio } from "@heroui/radio";
import AdminSection from "@/app/admin/users/create/_components/AdminSection";
import StudentSection from "@/app/admin/users/create/_components/StudentSection";
import AlumniSection from "@/app/admin/users/create/_components/AlumniSection";
import { useRouter } from "next/navigation";

const UserForm = ({ initialData, onSubmit, loading, isEdit = false }) => {
  const router = useRouter();

  const [imagePreview, setImagePreview] = useState(initialData?.image || null);
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: "student",
      status: "Active",
      district: "Malappuram",
      guardian_relation: "Father",
      batch: new Date().getFullYear().toString(),
      dob: initialData?.dob
        ? new Date(initialData.dob).toISOString().split("T")[0]
        : "",
      date_of_admission: initialData?.date_of_admission
        ? new Date(initialData.date_of_admission).toISOString().split("T")[0]
        : "",
      password: "",
      ...initialData,
    },
  });

  const selectedRole = watch("role");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setValue("image", file, { shouldValidate: true });
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
    setValue("image", null, { shouldValidate: true });
  };

  const onFormSubmit = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "image") {
        if (selectedFile) formData.append("image", selectedFile);
      } else if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });
    onSubmit(formData);
  };

  console.log(errors, "errors");

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      <Card className="bg-surface-light dark:bg-surface-dark border-slate-200 dark:border-slate-800 shadow-sm overflow-visible">
        <CardBody className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Header / Image */}
            {selectedRole !== "admin" && (
              <div className="flex flex-col items-center justify-center col-span-2 space-y-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                {/* Image Upload at Top */}
                <div className="relative group">
                  <div
                    className={`w-32 h-32 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border-2 border-dashed ${errors.image ? "border-danger" : "border-slate-300 dark:border-slate-700"} flex items-center justify-center relative`}
                  >
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <div className="text-center text-slate-400">
                        <Camera size={32} className="mx-auto mb-2" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          Upload Photo{" "}
                          {selectedRole !== "admin" && (
                            <span className="text-red-500">*</span>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                </div>
                {errors.image && (
                  <p className="text-xs text-danger font-bold uppercase">
                    {errors.image.message}
                  </p>
                )}
              </div>
            )}

            {/* Role Selection as Radio below image */}
            <div className="col-span-2 w-full">
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    label={
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Select Role <span className="text-red-500">*</span>
                      </span>
                    }
                    value={field.value}
                    onValueChange={field.onChange}
                    isInvalid={!!errors.role}
                    errorMessage={errors.role?.message}
                    orientation="horizontal"
                  >
                    <div className="flex gap-4">
                      <Radio value="student">Student</Radio>
                      <Radio value="alumni">Alumni</Radio>
                      <Radio value="admin">Admin</Radio>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>

            {/* Role Specific Fields */}
            {selectedRole === "admin" && (
              <AdminSection
                register={register}
                errors={errors}
                control={control}
                isEdit={isEdit}
              />
            )}

            {selectedRole === "student" && (
              <StudentSection
                register={register}
                errors={errors}
                control={control}
                watch={watch}
                isEdit={isEdit}
              />
            )}

            {selectedRole === "alumni" && (
              <AlumniSection
                register={register}
                errors={errors}
                control={control}
                watch={watch}
                isEdit={isEdit}
              />
            )}
          </div>

          <div className="mt-10 flex justify-end gap-4">
            <Button
              type="button"
              variant="light"
              onPress={() => router.push("/admin/users")}
              className="font-bold text-slate-600 dark:text-slate-400"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              isLoading={loading}
              startContent={!loading && <Save size={18} />}
              className="px-8 font-bold shadow-lg"
              radius="lg"
            >
              {isEdit ? "Update User" : "Create User"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </form>
  );
};

export default UserForm;

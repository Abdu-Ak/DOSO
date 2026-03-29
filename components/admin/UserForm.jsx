import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "@/lib/validations/userSchema";
import { Camera, X, Save } from "lucide-react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { RadioGroup, Radio } from "@heroui/radio";
import AdminSection from "@/app/admin/users/create/_components/AdminSection";
import AlumniSection from "@/app/admin/users/create/_components/AlumniSection";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const UserForm = ({ initialData, onSubmit, loading, isEdit = false }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const currentUser = session?.user;

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
      ...initialData,
      role: initialData?.role || "alumni",
      status: initialData?.status || "Active",
      district: initialData?.district || "Malappuram",
      guardian_relation: initialData?.guardian_relation || "Father",
      batch: initialData?.batch || new Date().getFullYear().toString(),
      dob: initialData?.dob
        ? new Date(initialData.dob).toISOString().split("T")[0]
        : "",
      date_of_admission: initialData?.date_of_admission
        ? new Date(initialData.date_of_admission).toISOString().split("T")[0]
        : "",
      password: "",
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

  const isSelfEdit = isEdit && currentUser?._id === initialData?._id;

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className=" space-y-4 md:space-y-8"
    >
      <Card className="bg-surface-light dark:bg-surface-dark border-slate-200 dark:border-slate-800 shadow-sm overflow-visible">
        <CardBody className="p-4 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Header / Image */}
            {selectedRole !== "admin" && selectedRole !== "super_admin" && (
              <div className="flex flex-col items-center justify-center col-span-1 md:col-span-2 space-y-4 pb-6 border-b border-slate-100 dark:border-slate-800">
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
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-lg"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <div className="text-center text-slate-400">
                        <Camera size={32} className="mx-auto mb-2" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          Upload Photo{" "}
                          {selectedRole !== "admin" &&
                            selectedRole !== "super_admin" && (
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

            <div className="col-span-1 md:col-span-2 w-full">
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
                    isDisabled={isSelfEdit}
                  >
                    <div className="flex flex-wrap gap-x-3 md:gap-x-6 gap-y-3">
                      {currentUser?.role === "super_admin" && (
                        <Radio value="super_admin">Super Admin</Radio>
                      )}
                      <Radio value="admin">Admin</Radio>
                      <Radio value="alumni">Alumni</Radio>
                    </div>
                  </RadioGroup>
                )}
              />
              {isSelfEdit && (
                <p className="text-xs text-slate-500 mt-1 italic">
                  You cannot change your own role.
                </p>
              )}
            </div>

            {/* Role Specific Fields */}
            {(selectedRole === "admin" || selectedRole === "super_admin") && (
              <AdminSection
                register={register}
                errors={errors}
                control={control}
                isEdit={isEdit}
                isSelfEdit={isSelfEdit}
              />
            )}

            {selectedRole === "alumni" && (
              <AlumniSection
                register={register}
                errors={errors}
                control={control}
                watch={watch}
                isEdit={isEdit}
                isSelfEdit={isSelfEdit}
              />
            )}
          </div>

          <div className="mt-10 flex justify-between md:justify-end gap-2 md:gap-6">
            <Button
              type="button"
              variant="light"
              onPress={() => router.push("/admin/users")}
              className="w-fit sm:w-auto font-bold text-slate-600 dark:text-slate-400 h-11"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              isLoading={loading}
              startContent={!loading && <Save size={18} />}
              className="w-fit sm:w-auto font-bold shadow-lg h-11"
              radius="lg"
            >
              {isEdit ? "Update user" : "Create user"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </form>
  );
};

export default UserForm;

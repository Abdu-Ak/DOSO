"use client";

import React from "react";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";

const UserFilters = ({
  role,
  setRole,
  status,
  setStatus,
  district,
  setDistrict,
  batch,
  setBatch,
  setPage,
}) => {
  const districts = [
    "Thiruvananthapuram",
    "Kollam",
    "Pathanamthitta",
    "Alappuzha",
    "Kottayam",
    "Idukki",
    "Ernakulam",
    "Thrissur",
    "Palakkad",
    "Malappuram",
    "Kozhikode",
    "Wayanad",
    "Kannur",
    "Kasaragod",
    "Other",
  ];

  return (
    <div className="flex flex-wrap gap-3 w-full sm:w-auto">
      <Select
        className="w-full sm:w-32"
        placeholder="Role"
        variant="bordered"
        radius="lg"
        selectedKeys={role ? [role] : []}
        onSelectionChange={(keys) => {
          setRole(Array.from(keys)[0] || "");
          setPage(1);
        }}
      >
        <SelectItem key="" value="">
          All Roles
        </SelectItem>
        <SelectItem key="admin" value="admin">
          Admin
        </SelectItem>
        <SelectItem key="alumni" value="alumni">
          Alumni
        </SelectItem>
        <SelectItem key="student" value="student">
          Student
        </SelectItem>
      </Select>

      <Select
        className="w-full sm:w-32"
        placeholder="Status"
        variant="bordered"
        radius="lg"
        selectedKeys={status ? [status] : []}
        onSelectionChange={(keys) => {
          setStatus(Array.from(keys)[0] || "");
          setPage(1);
        }}
      >
        <SelectItem key="" value="">
          All Status
        </SelectItem>
        <SelectItem key="Active" value="Active">
          Active
        </SelectItem>
        <SelectItem key="Pending" value="Pending">
          Pending
        </SelectItem>
        <SelectItem key="Inactive" value="Inactive">
          Inactive
        </SelectItem>
      </Select>

      <Select
        className="w-full sm:w-40"
        placeholder="District"
        variant="bordered"
        radius="lg"
        selectedKeys={district ? [district] : []}
        onSelectionChange={(keys) => {
          setDistrict(Array.from(keys)[0] || "");
          setPage(1);
        }}
      >
        <SelectItem key="" value="">
          All Districts
        </SelectItem>
        {districts.map((d) => (
          <SelectItem key={d} value={d}>
            {d}
          </SelectItem>
        ))}
      </Select>

      <Select
        className="w-full sm:w-32"
        placeholder="Batch"
        variant="bordered"
        radius="lg"
        selectedKeys={batch ? [batch] : []}
        onSelectionChange={(keys) => {
          setBatch(Array.from(keys)[0] || "");
          setPage(1);
        }}
      >
        <SelectItem key="" value="">
          All Batches
        </SelectItem>
        {Array.from({ length: 11 }, (_, i) => 2020 + i).map((year) => (
          <SelectItem key={year.toString()} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </Select>

      <Button
        as={Link}
        href="/admin/users/create"
        color="primary"
        startContent={<UserPlus size={18} />}
        className="font-bold shadow-lg shadow-primary/20 w-full sm:w-auto"
        radius="lg"
      >
        Add User
      </Button>
    </div>
  );
};

export default UserFilters;

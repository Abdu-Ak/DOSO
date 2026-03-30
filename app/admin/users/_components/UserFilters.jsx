"use client";

import React from "react";
import Link from "next/link";
import { UserPlus, Search, Filter } from "lucide-react";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Input } from "@heroui/input";

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
  showFilters = true,
  setShowFilters,
  searchTerm,
  onSearchChange,
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
    <div className="flex flex-col lg:flex-row lg:items-center gap-4 w-full">
      {/* Search and Mobile Actions */}
      <div className="flex items-center gap-2 w-full lg:w-auto lg:flex-1">
        <Input
          isClearable
          className="flex-1 lg:max-w-md"
          placeholder="Search by name, email or user ID..."
          startContent={<Search size={18} className="text-slate-400" />}
          value={searchTerm}
          onClear={() => onSearchChange("")}
          onValueChange={onSearchChange}
          variant="bordered"
          radius="lg"
        />
        <Button
          isIconOnly
          variant="flat"
          onPress={() => setShowFilters(!showFilters)}
          className="lg:hidden text-slate-600 dark:text-slate-400"
          radius="lg"
        >
          <Filter size={18} />
        </Button>
        <Button
          as={Link}
          href="/admin/users/create"
          isIconOnly
          color="primary"
          className="lg:hidden shadow-lg shadow-primary/20"
          radius="lg"
        >
          <UserPlus size={18} />
        </Button>
      </div>

      {/* Filters (Collapsible on mobile) */}
      <div
        className={`flex flex-wrap items-center gap-3 w-full lg:w-auto ${!showFilters ? "hidden lg:flex" : "flex"}`}
      >
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
          className="hidden lg:flex font-bold shadow-lg shadow-primary/20 w-auto"
          radius="lg"
        >
          Add User
        </Button>
      </div>
    </div>
  );
};

export default UserFilters;

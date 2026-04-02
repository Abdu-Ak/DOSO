"use client";

import React, { useState, useMemo } from "react";
import {
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Search,
} from "lucide-react";
import { Chip } from "@heroui/chip";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { DateRangePicker } from "@heroui/date-picker";
import { parseDate } from "@internationalized/date";
import { useEnquiries } from "./_hooks/useEnquiries";
import CustomTooltip from "@/components/admin/ui/CustomTooltip";
import ConfirmModal from "@/components/admin/ui/ConfirmModal";
import MobileEnquiryList from "./_components/MobileEnquiryList";

const statusColorMap = {
  Pending: "warning",
  Completed: "success",
  Cancelled: "danger",
};

const statusIconMap = {
  Pending: <Clock size={16} />,
  Completed: <CheckCircle2 size={16} />,
  Cancelled: <XCircle size={16} />,
};

export default function EnquiriesPage() {
  const { enquiries, isLoading, updateStatusMutation, deleteMutation } =
    useEnquiries();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [enquiryToDelete, setEnquiryToDelete] = useState(null);

  const dateValue =
    startDate && endDate
      ? {
          start: parseDate(startDate),
          end: parseDate(endDate),
        }
      : null;

  const filteredEnquiries = useMemo(() => {
    if (!startDate || !endDate) return enquiries;
    return enquiries.filter((item) => {
      const itemDate = new Date(item.createdAt).toISOString().split("T")[0];
      return itemDate >= startDate && itemDate <= endDate;
    });
  }, [enquiries, startDate, endDate]);

  const handleStatusChangeArray = (id, newStatusSet) => {
    const newStatus = Array.from(newStatusSet)[0];
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const confirmDelete = async () => {
    if (enquiryToDelete) {
      await deleteMutation.mutateAsync(enquiryToDelete._id);
      setIsDeleteModalOpen(false);
      setEnquiryToDelete(null);
    }
  };

  const renderCell = (enquiry, columnKey) => {
    const cellValue = enquiry[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
            <p className="text-bold text-xs text-slate-400">{enquiry.phone}</p>
          </div>
        );
      case "subject":
        return <p className="text-sm font-medium">{cellValue}</p>;
      case "message":
        return (
          <CustomTooltip
            content={cellValue}
            placement="bottom-start"
            className="max-w-[400px]"
          >
            <p className="text-sm truncate max-w-[250px] text-slate-600 dark:text-slate-400 cursor-help">
              {cellValue}
            </p>
          </CustomTooltip>
        );
      case "status":
        return (
          <Dropdown>
            <DropdownTrigger>
              <div className="cursor-pointer">
                <Chip
                  className="capitalize select-none"
                  color={statusColorMap[enquiry.status]}
                  size="sm"
                  variant="flat"
                  startContent={statusIconMap[enquiry.status]}
                >
                  {cellValue}
                </Chip>
              </div>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Change Status"
              onSelectionChange={(keys) =>
                handleStatusChangeArray(enquiry._id, keys)
              }
              selectionMode="single"
              selectedKeys={[enquiry.status]}
            >
              <DropdownItem
                key="Completed"
                startContent={
                  <CheckCircle2 className="text-success" size={16} />
                }
              >
                Mark Completed
              </DropdownItem>
              <DropdownItem
                key="Cancelled"
                startContent={<XCircle className="text-danger" size={16} />}
              >
                Mark Cancelled
              </DropdownItem>
              <DropdownItem
                key="Pending"
                startContent={<Clock className="text-warning" size={16} />}
              >
                Mark Pending
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      case "createdAt":
        return (
          <p className="text-xs text-slate-400 font-medium whitespace-nowrap">
            {new Date(cellValue).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        );
      case "actions":
        return (
          <div className="flex justify-end items-center px-2">
            <CustomTooltip color="danger" content="Delete permanently">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="danger"
                className="hover:bg-danger/10"
                onPress={() => {
                  setEnquiryToDelete(enquiry);
                  setIsDeleteModalOpen(true);
                }}
              >
                <Trash2 size={18} />
              </Button>
            </CustomTooltip>
          </div>
        );
      default:
        return cellValue;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header and Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-800 dark:text-white">
            Enquiries
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Manage student and admissions inquiries efficiently
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <DateRangePicker
            className="w-full sm:w-64"
            variant="bordered"
            radius="lg"
            placeholderValue={parseDate(new Date().toISOString().split("T")[0])}
            value={dateValue}
            onChange={(val) => {
              if (val) {
                setStartDate(val.start.toString());
                setEndDate(val.end.toString());
              } else {
                setStartDate("");
                setEndDate("");
              }
            }}
            aria-label="Filter by date range"
            classNames={{
              inputWrapper:
                "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700",
            }}
          />
          {(startDate || endDate) && (
            <Button
              size="sm"
              variant="flat"
              onPress={() => {
                setStartDate("");
                setEndDate("");
              }}
              className="text-xs font-bold uppercase tracking-wider"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Table - Desktop */}
      <div className="hidden lg:block bg-white dark:bg-slate-900 overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 rounded-3xl">
        <Table
          aria-label="Student inquiries management"
          shadow="none"
          selectionMode="none"
          className="border-none"
        >
          <TableHeader>
            <TableColumn key="name">CONTACT INFO</TableColumn>
            <TableColumn key="subject">SUBJECT</TableColumn>
            <TableColumn key="message">ENQUIRY DETAILS</TableColumn>
            <TableColumn key="status">STATUS</TableColumn>
            <TableColumn key="createdAt">RECEIVED ON</TableColumn>
            <TableColumn key="actions" align="end">
              OPERATIONS
            </TableColumn>
          </TableHeader>
          <TableBody
            items={filteredEnquiries}
            loadingContent={
              <div className="p-10 flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-3 border-primary border-t-transparent animate-spin rounded-full"></div>
                <p className="text-sm font-medium text-slate-400">
                  Loading inquiries...
                </p>
              </div>
            }
            loadingState={isLoading ? "loading" : "idle"}
            emptyContent={"No inquiries matches the criteria."}
          >
            {(item) => (
              <TableRow
                key={item._id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-default"
              >
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View */}
      <MobileEnquiryList
        enquiries={filteredEnquiries}
        isLoading={isLoading}
        onStatusChange={handleStatusChangeArray}
        onDelete={(enquiry) => {
          setEnquiryToDelete(enquiry);
          setIsDeleteModalOpen(true);
        }}
        statusColorMap={statusColorMap}
        statusIconMap={statusIconMap}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setEnquiryToDelete(null);
        }}
        onConfirm={confirmDelete}
        isLoading={deleteMutation.isPending}
        title="Delete Enquiry"
        message={
          <>
            <p>
              Are you sure you want to delete the enquiry from &quot;
              {enquiryToDelete?.name}&quot;?
            </p>
            <p className="mt-1">This action cannot be undone.</p>
          </>
        }
      />
    </div>
  );
}

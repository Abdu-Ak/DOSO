import React from "react";
import { User } from "@heroui/user";
import { Chip } from "@heroui/chip";
import { Switch } from "@heroui/switch";
import { Eye, Edit, Trash2, MoreVertical, CalendarCog } from "lucide-react";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { format } from "date-fns";
import Link from "next/link";

export const getEventColumns = ({
  onEdit,
  onDelete,
  onView,
  onToggleVisibility,
}) => [
  {
    header: "EVENT",
    accessorKey: "title",
    cell: (info) => {
      const event = info.row.original;
      return (
        <div className="flex items-center justify-between gap-2 group pr-4">
          <User
            avatarProps={{ radius: "lg", src: event.mainImage }}
            description={
              event.description?.substring(0, 30) +
              (event.description?.length > 30 ? "..." : "")
            }
            name={event.title}
          />
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light">
                <MoreVertical size={18} className="text-slate-400" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Event actions" variant="flat">
              <DropdownItem
                key="view"
                as={Link}
                href={`/admin/events/${event._id}`}
                startContent={<Eye size={16} />}
                className="text-slate-700 dark:text-slate-300"
              >
                View Details
              </DropdownItem>
              <DropdownItem
                key="edit"
                as={Link}
                href={`/admin/events/${event._id}/edit`}
                startContent={<CalendarCog size={16} />}
                className="text-slate-700 dark:text-slate-300"
              >
                Edit Event
              </DropdownItem>
              <DropdownItem
                key="delete"
                color="danger"
                startContent={<Trash2 size={16} />}
                onPress={() => onDelete(event)}
                className="text-danger"
              >
                Delete Event
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      );
    },
  },
  {
    header: "CATEGORY",
    accessorKey: "type",
    cell: (info) => (
      <Chip className="capitalize" size="sm" variant="flat" color="secondary">
        {info.getValue()}
      </Chip>
    ),
  },
  {
    header: "DATE & TIME",
    id: "dateTime",
    cell: (info) => {
      const event = info.row.original;
      return (
        <div className="flex flex-col">
          <p className="font-medium text-sm capitalize ">
            {format(new Date(event.date), "dd MMM yyyy")}
          </p>
          <p className="font-medium text-tiny capitalize text-default-400">
            {event.time}
          </p>
        </div>
      );
    },
  },
  {
    header: "LOCATION",
    accessorKey: "heldingPlace",
    cell: (info) => <p className="text-sm font-medium">{info.getValue()}</p>,
  },
  {
    header: "PUBLIC VISIBILITY",
    accessorKey: "isVisible",
    cell: (info) => {
      const event = info.row.original;
      return (
        <Switch
          isSelected={event.isVisible}
          size="sm"
          color="success"
          onValueChange={(val) => onToggleVisibility(event._id, val)}
        />
      );
    },
  },
];

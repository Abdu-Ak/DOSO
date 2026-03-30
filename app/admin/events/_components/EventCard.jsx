"use client";

import React from "react";
import Link from "next/link";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Switch } from "@heroui/switch";
import {
  Trash2,
  Eye,
  Edit,
  MapPin,
  Calendar,
  Clock,
  MoreVertical,
  CalendarCog,
} from "lucide-react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { format } from "date-fns";

const EventCard = ({ event, onToggleVisibility, onDelete }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden shrink-0">
          {event.mainImage ? (
            <img
              src={event.mainImage}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-primary font-bold text-xl uppercase">
              {event.title?.charAt(0)}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate">
              {event.title}
            </h4>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="text-slate-400"
                >
                  <MoreVertical size={16} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Event actions">
                <DropdownItem
                  as={Link}
                  href={`/admin/events/${event._id}`}
                  startContent={<Eye size={16} />}
                >
                  View details
                </DropdownItem>
                <DropdownItem
                  as={Link}
                  href={`/admin/events/${event._id}/edit`}
                  startContent={<CalendarCog size={16} />}
                >
                  Edit event
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  startContent={<Trash2 size={16} />}
                  onPress={() => onDelete(event)}
                >
                  Delete event
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            <Chip
              color="secondary"
              size="sm"
              variant="flat"
              className="capitalize text-xs font-bold"
            >
              {event.type}
            </Chip>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-slate-400 shrink-0" />
          <span>{format(new Date(event.date), "dd MMM yyyy")}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-slate-400 shrink-0" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-slate-400 shrink-0" />
          <span className="truncate">{event.heldingPlace}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Public Visibility
        </span>
        <Switch
          isSelected={event.isVisible}
          size="sm"
          color="success"
          onValueChange={(val) => onToggleVisibility(event._id, val)}
        />
      </div>
    </div>
  );
};

export default EventCard;

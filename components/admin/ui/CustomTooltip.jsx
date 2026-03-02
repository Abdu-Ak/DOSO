"use client";

import React from "react";
import { Tooltip } from "@heroui/tooltip";

/**
 * Reusable CustomTooltip component that standardizes:
 * - Black background with white text
 * - Arrow support (default true)
 * - Defined padding and rounded corners
 */
export const CustomTooltip = ({
  children,
  content,
  placement = "bottom",
  showArrow = true,
  ...props
}) => {
  return (
    <Tooltip
      content={content}
      placement={placement}
      showArrow={showArrow}
      classNames={{
        content:
          "bg-black text-white px-3 py-1.5 rounded-md text-xs font-medium shadow-lg",
        base: "before:bg-black",
      }}
      {...props}
    >
      {children}
    </Tooltip>
  );
};

export default CustomTooltip;

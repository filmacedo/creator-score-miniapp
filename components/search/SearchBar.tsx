"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search creators by name…",
  disabled = false,
  className,
}: SearchBarProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <Icon
        icon={Search}
        color="muted"
        className="absolute left-3 top-1/2 -translate-y-1/2"
      />
      <Input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        placeholder={placeholder}
        disabled={disabled}
        className="!pl-10 pr-3 h-12 text-base"
      />
    </div>
  );
}

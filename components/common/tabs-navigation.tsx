"use client";

import type React from "react";
import Link from "next/link";

interface Tab {
  id: string;
  label: string;
  href?: string; // Optional href for routing
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
  indicator?: "live" | "new" | boolean;
  disabled?: boolean;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange?: (tabId: string) => void; // Made optional for routing mode
  showCounts?: boolean;
  className?: string;
}

export function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
  showCounts = true,
  className = "",
}: TabNavigationProps) {
  return (
    <div
      className={`flex border-b border-border bg-background overflow-x-auto ${className}`}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        const baseClassName = `flex items-center justify-center gap-2 px-4 py-3 text-center relative whitespace-nowrap ${
          tabs.length <= 3 ? "flex-1" : "min-w-0"
        } ${
          tab.disabled
            ? "text-muted-foreground cursor-not-allowed"
            : isActive
              ? "text-foreground"
              : "text-muted-foreground"
        }`;

        const content = (
          <>
            {/* Icon if provided */}
            {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}

            {/* Label */}
            <span className="text-sm font-normal">{tab.label}</span>

            {/* Count badge - only for sponsors */}
            {showCounts && tab.count !== undefined && (
              <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full font-normal flex-shrink-0 min-w-[20px] text-center">
                {tab.count}
              </span>
            )}

            {/* Active indicator line */}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
            )}
          </>
        );

        // Use Link for routing mode, button for callback mode
        if (tab.href && !tab.disabled) {
          return (
            <Link key={tab.id} href={tab.href} className={baseClassName}>
              {content}
            </Link>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onTabChange?.(tab.id)}
            disabled={tab.disabled}
            className={baseClassName}
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}

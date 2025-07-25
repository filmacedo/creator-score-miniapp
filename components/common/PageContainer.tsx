import * as React from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function PageContainer({
  children,
  className,
  noPadding = false,
  ...props
}: PageContainerProps) {
  return (
    <div className="min-h-screen">
      <main className="flex-1 overflow-y-auto relative">
        <div
          className={cn(
            "max-w-xl mx-auto w-full pb-24",
            !noPadding && "px-4",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </main>
    </div>
  );
}

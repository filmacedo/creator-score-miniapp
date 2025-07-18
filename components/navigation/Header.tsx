"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useUserNavigation } from "@/hooks/useUserNavigation";
import { useBackButton } from "@/hooks/useBackButton";
import { FarcasterAccessModal } from "@/components/modals/FarcasterAccessModal";

export function Header() {
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { navItems, settingsItem, user } = useUserNavigation();
  const { shouldShowBackButton, handleBack } = useBackButton();
  const [showModal, setShowModal] = React.useState(false);
  const [modalFeature, setModalFeature] = React.useState<
    "Profile" | "Settings"
  >("Profile");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleTitleClick = () => {
    router.push("/");
  };

  const handleNavClick = (
    item: (typeof navItems)[0] | typeof settingsItem,
    e: React.MouseEvent,
  ) => {
    // If user tries to access Profile or Settings without user context, show modal
    if (!user && (item.label === "Profile" || item.label === "Settings")) {
      e.preventDefault();
      setModalFeature(item.label as "Profile" | "Settings");
      setShowModal(true);
      return;
    }
    // Otherwise, navigate normally (Link component handles it)
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-white backdrop-blur supports-[backdrop-filter]:bg-white">
        <div className="flex h-14 w-full items-center justify-between px-4 md:px-8 relative">
          {shouldShowBackButton ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center justify-center h-10 w-10 rounded-full transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              aria-label="Go back"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          ) : (
            <h1
              className="text-lg font-semibold cursor-pointer hover:opacity-70 transition-opacity"
              onClick={handleTitleClick}
            >
              Creator Score
            </h1>
          )}

          {/* Desktop nav icons - simplified responsive approach */}
          <nav
            className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2"
            style={{ display: "none" }}
          >
            {mounted &&
              navItems.map((item) => {
                const isActive = pathname === item.href;
                if (item.disabled) {
                  return (
                    <span
                      key={item.label}
                      className="flex items-center justify-center h-10 w-12 rounded-full text-muted-foreground opacity-50 cursor-not-allowed"
                      aria-label={item.label}
                    >
                      <item.icon className="h-6 w-6" />
                    </span>
                  );
                }
                if (item.href) {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={(e) => handleNavClick(item, e)}
                      className={`flex items-center justify-center h-10 w-12 rounded-full transition-colors ${
                        isActive
                          ? "bg-muted text-primary"
                          : "text-muted-foreground hover:bg-muted/50"
                      }`}
                      aria-label={item.label}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <item.icon className="h-6 w-6" />
                    </Link>
                  );
                }
                return null;
              })}
          </nav>

          {/* Settings link - right aligned */}
          <div className="flex items-center">
            {mounted && (
              <Link
                href={settingsItem.href}
                onClick={(e) => handleNavClick(settingsItem, e)}
                className={`flex items-center justify-center h-10 w-12 rounded-full transition-colors ${
                  pathname === settingsItem.href
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:bg-muted/50"
                }`}
                aria-label={settingsItem.label}
                aria-current={
                  pathname === settingsItem.href ? "page" : undefined
                }
              >
                <settingsItem.icon className="h-6 w-6" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* CSS to show nav on desktop only */}
      <style jsx>{`
        @media (min-width: 768px) {
          nav {
            display: flex !important;
          }
        }
      `}</style>

      <FarcasterAccessModal
        open={showModal}
        onOpenChange={setShowModal}
        feature={modalFeature}
      />
    </>
  );
}

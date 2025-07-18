"use client";

import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { getUserContext } from "@/lib/user-context";
import { resolveFidToTalentUuid } from "@/lib/user-resolver";
import { User, Trophy, Settings, Search } from "lucide-react";
import { useState, useEffect } from "react";

export function useUserNavigation() {
  const { context } = useMiniKit();
  const user = getUserContext(context);
  const [talentUuid, setTalentUuid] = useState<string | null>(null);

  // Resolve FID to Talent UUID for navigation
  useEffect(() => {
    async function resolveTalentUuid() {
      if (user?.fid) {
        try {
          const uuid = await resolveFidToTalentUuid(user.fid);
          setTalentUuid(uuid);
        } catch (error) {
          console.error("Error resolving talent UUID:", error);
          setTalentUuid(null);
        }
      }
    }

    resolveTalentUuid().catch((error) => {
      console.error("Unhandled error in resolveTalentUuid:", error);
    });
  }, [user?.fid]);

  // Determine canonical identifier for navigation
  // Priority: Talent UUID > Farcaster username > fallback to /profile
  const canonical = talentUuid || user?.username;

  const navItems = [
    {
      href: canonical ? `/${canonical}` : "/profile",
      icon: User,
      label: "Profile",
      disabled: false,
    },
    {
      href: "/leaderboard",
      icon: Trophy,
      label: "Leaderboard",
    },
    {
      href: "/explore",
      icon: Search,
      label: "Explore",
    },
  ];

  // Settings item for top nav
  const settingsItem = {
    href: "/settings",
    icon: Settings,
    label: "Settings",
  };

  return {
    user,
    canonical,
    navItems,
    settingsItem,
    talentUuid, // Export this for other components that might need it
  };
}

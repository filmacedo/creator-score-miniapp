"use client";

import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { getUserContext } from "@/lib/user-context";
import { useUserResolution } from "@/hooks/useUserResolution";
import { User, Trophy, Settings2, Search } from "lucide-react";

export function useUserNavigation() {
  const { context } = useMiniKit();
  const user = getUserContext(context);
  const { talentUuid } = useUserResolution();

  console.log("[USE USER NAVIGATION] talentUuid", talentUuid);

  // Determine canonical identifier for navigation
  // Priority: Talent UUID > Farcaster username > fallback to /profile
  const canonical = talentUuid || user?.username;

  // Store both possible profile paths for active state check
  const profilePaths = [
    canonical ? `/${canonical}` : "/profile",
    user?.username ? `/${user.username}` : null,
    talentUuid ? `/${talentUuid}` : null,
  ].filter(Boolean) as string[];

  const navItems = [
    {
      href: profilePaths[0], // Use first path (canonical) for navigation
      icon: User,
      label: "Profile",
      disabled: false,
      // Store all possible paths for active state check
      alternateHrefs: profilePaths.slice(1),
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
    icon: Settings2,
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

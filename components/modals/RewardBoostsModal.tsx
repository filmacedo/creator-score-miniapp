"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ButtonFullWidth } from "@/components/ui/button-full-width";
import { Coins } from "lucide-react";
import { formatTokenAmount, detectClient, openExternalUrl } from "@/lib/utils";
import { BOOST_CONFIG } from "@/lib/constants";

// TALENT token CAIP-19 asset ID on Base chain
const TALENT_TOKEN_CAIP19 =
  "eip155:8453/erc20:0x9a33406165f562e16c3abd82fd1185482e01b49a";

/**
 * Handle token swap with Farcaster native swap or fallback to Aerodrome
 */
async function handleGetTalent(fallbackUrl: string): Promise<void> {
  console.log("🚀 handleGetTalent called");
  
  const client = await detectClient();
  console.log("🔍 Detected client:", client);
  
  // Try Farcaster native swap first
  if (client === "farcaster" || client === "base") {
    try {
      console.log("📱 Attempting native swap with TALENT token:", TALENT_TOKEN_CAIP19);
      
      const { sdk } = await import("@farcaster/miniapp-sdk");
      console.log("✅ SDK imported successfully");
      
      // Ensure SDK is ready
      await sdk.actions.ready();
      console.log("✅ SDK ready");
      
      const result = await sdk.actions.swapToken({
        buyToken: TALENT_TOKEN_CAIP19,
        // sellToken and sellAmount are optional - user can choose what to sell
      });
      
      console.log("✅ Native swap result:", result);
      
      // Check if the swap was successful
      if (result.success) {
        console.log("🎉 Swap completed successfully:", result.swap);
      } else {
        console.warn("⚠️ Swap was not successful:", result.reason, result.error);
        // Don't throw error here, let user know what happened
        if (result.reason === "rejected_by_user") {
          console.log("👤 User rejected the swap");
          return; // User cancelled, don't fall back to external URL
        }
        // For other failures, fall through to external URL
        throw new Error(`Swap failed: ${result.reason}`);
      }
      return; // Success - no need for fallback
    } catch (error) {
      console.error("❌ Native swap failed:", error);
      console.error("Error details:", {
        name: (error as Error)?.name,
        message: (error as Error)?.message,
        stack: (error as Error)?.stack,
      });
      // Fall through to external URL fallback
    }
  }
  
  console.log("🔄 Falling back to Aerodrome URL:", fallbackUrl);
  // Fallback to external Aerodrome URL
  await openExternalUrl(fallbackUrl, null, client);
}

interface RewardBoostsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rewardUsd: string; // base reward without boost, pre-formatted
  tokenBalance?: number | null;
  boostUsd: string; // boost amount, pre-formatted
  totalUsd: string; // total reward with boost applied, pre-formatted
  getTalentUrl?: string; // override link if needed
  rank?: number;
  score: number;
}

function Content({
  rewardUsd,
  tokenBalance,
  boostUsd,
  totalUsd,
  rank,
  score,
  getTalentUrl = "https://aerodrome.finance/swap?from=eth&to=0x9a33406165f562e16c3abd82fd1185482e01b49a&chain0=8453&chain1=8453",
}: Omit<RewardBoostsModalProps, "open" | "onOpenChange">) {
  const tokenNumber =
    tokenBalance !== null && tokenBalance !== undefined ? tokenBalance : 0;
  const tokenDisplay = `${formatTokenAmount(tokenNumber)}`;
  const isTop200 = typeof rank === "number" && rank <= 200;
  const rewardDisplay = isTop200 ? rewardUsd : "Not eligible";
  const boostDisplay = (() => {
    if (tokenNumber < BOOST_CONFIG.TOKEN_THRESHOLD) return "Not eligible";
    if (!isTop200) return "$0";
    return boostUsd || "$0";
  })();

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Your Rewards
        </p>
        <div className="space-y-2">
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Creator Reward</span>
            <span>{rewardDisplay}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Boost Amount</span>
            <span>{boostDisplay}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-brand-purple">Total Reward</span>
            <span className="font-medium text-brand-purple">{totalUsd}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Your Stats
        </p>
        <div className="space-y-2">
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Creator Rank</span>
            <span>{isTop200 ? `#${rank}` : "—"}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Creator Score</span>
            <span>{score ?? "—"}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">$TALENT Tokens</span>
            <span>{tokenDisplay}</span>
          </div>
        </div>
      </div>

      <ButtonFullWidth
        variant="brand-purple"
        icon={<Coins className="h-4 w-4" />}
        align="left"
        onClick={async (e) => {
          try {
            e.preventDefault();
            console.log("🎯 Get $TALENT button clicked");
            await handleGetTalent(getTalentUrl);
          } catch (error) {
            console.error("❌ Button click handler failed:", error);
            // Don't let the error bubble up and close the modal
          }
        }}
      >
        Get $TALENT
      </ButtonFullWidth>
    </div>
  );
}

export function RewardBoostsModal(props: RewardBoostsModalProps) {
  const { open, onOpenChange, ...contentProps } = props;
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader className="text-left">
            <DialogTitle>Reward Boosts</DialogTitle>
            <DialogDescription>
              Hold {BOOST_CONFIG.TOKEN_THRESHOLD}+ $TALENT to get a 10% rewards
              boost.
            </DialogDescription>
          </DialogHeader>
          <Content {...contentProps} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Reward Boosts</DrawerTitle>
          <DrawerDescription>
            Hold {BOOST_CONFIG.TOKEN_THRESHOLD}+ $TALENT to get a 10% rewards
            boost.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-8">
          <Content {...contentProps} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

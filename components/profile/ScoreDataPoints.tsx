import * as React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  shouldShowUom,
  formatReadableValue,
  cleanCredentialLabel,
} from "@/lib/utils";
import { sdk } from "@farcaster/frame-sdk";
import { COMING_SOON_CREDENTIALS } from "./comingSoonCredentials";
import { useProfileContext } from "@/contexts/ProfileContext";
import {
  mergeCredentialsWithComingSoon,
  sortCredentialsByTotal,
} from "@/lib/credentialUtils";

export function ScoreDataPoints() {
  const { profileData } = useProfileContext();

  // Extract data from server-fetched profileData
  const { credentials } = profileData;

  // No loading states needed - data comes from server
  const isLoading = false;
  const error = null;

  // Type assertion for server data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const typedCredentials = credentials as any;

  // Merge credentials with coming soon credentials using utility
  const allCredentials = mergeCredentialsWithComingSoon(
    typedCredentials,
    COMING_SOON_CREDENTIALS,
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="ml-3 text-sm text-muted-foreground">
          Loading score breakdown...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-sm text-destructive">{error}</div>
      </div>
    );
  }

  if (!typedCredentials || typedCredentials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <span className="text-muted-foreground text-sm">
          No score data available.
        </span>
        <span className="text-muted-foreground text-xs mt-2">
          Try calculating or refreshing your Creator Score to see detailed
          breakdown.
        </span>
      </div>
    );
  }

  if (allCredentials.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-sm text-muted-foreground">
          No score data available
        </div>
      </div>
    );
  }

  const handleCredentialClick = async (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    try {
      const externalUrl = `${url}${url.includes("?") ? "&" : "?"}_external=true`;
      await sdk.actions.openUrl(externalUrl);
    } catch {
      // Fallback to regular link if SDK fails
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const sortedCredentials = sortCredentialsByTotal(allCredentials);

  return (
    <div>
      <Accordion type="multiple" className="space-y-2">
        {sortedCredentials.map((issuer, index) => (
          <AccordionItem
            key={issuer.issuer}
            value={`issuer-${index}`}
            className="bg-card rounded-2xl shadow border p-0 mb-3"
          >
            <AccordionTrigger className="px-6 py-4 flex items-center justify-between">
              <div className="flex flex-col flex-1 gap-1">
                <span className="text-base font-medium text-foreground">
                  {issuer.issuer}
                </span>
                <span className="text-xs text-muted-foreground">
                  {issuer.points.filter((pt) => pt.value > 0).length}/
                  {issuer.points.length} credentials
                </span>
              </div>
              <span className="ml-4 text-xl font-semibold text-foreground w-16 text-right">
                {issuer.total}
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-5">
              <ul className="space-y-2">
                {issuer.points.map((pt) => (
                  <li
                    key={pt.label}
                    className="flex items-center justify-between text-xs"
                  >
                    <span
                      className="truncate text-muted-foreground max-w-[60%]"
                      title={pt.label}
                    >
                      {pt.external_url ? (
                        <a
                          href={pt.external_url}
                          onClick={(e) =>
                            handleCredentialClick(e, pt.external_url!)
                          }
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {cleanCredentialLabel(pt.label, issuer.issuer)}
                        </a>
                      ) : (
                        cleanCredentialLabel(pt.label, issuer.issuer)
                      )}
                    </span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {pt.max_score !== null ? (
                        <>
                          {pt.readable_value && pt.uom === "USDC" ? (
                            `$${formatReadableValue(pt.readable_value)}`
                          ) : pt.readable_value ? (
                            <>
                              {formatReadableValue(pt.readable_value, pt.uom)}
                              {shouldShowUom(pt.uom) && <span>{pt.uom}</span>}
                            </>
                          ) : null}
                          {pt.readable_value && (
                            <span className="mx-1 text-muted-foreground">
                              &middot;
                            </span>
                          )}
                          <span className="font-medium text-xs text-muted-foreground whitespace-nowrap">
                            {pt.value}/{pt.max_score}{" "}
                            {pt.value === 1 ? "pt" : "pts"}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          Coming soon
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

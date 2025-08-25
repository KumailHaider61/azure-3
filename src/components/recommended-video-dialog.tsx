"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getRecommendedVideo } from "@/lib/actions";
import { Button } from "./ui/button";
import { WandSparkles } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Terminal } from "lucide-react";

type Recommendation = {
  videoId?: string;
  reason?: string;
  error?: string;
};

interface RecommendedVideoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecommendedVideoDialog({
  open,
  onOpenChange,
}: RecommendedVideoDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null
  );

  useEffect(() => {
    if (open) {
      startTransition(async () => {
        const result = await getRecommendedVideo();
        setRecommendation(result);
      });
    } else {
        // Reset on close
        setRecommendation(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <WandSparkles className="text-primary" />
            Recommended For You
          </DialogTitle>
          <DialogDescription>
            Our AI has picked this video just for you based on your activity.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {isPending && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-8 w-full" />
            </div>
          )}
          {recommendation && !isPending && (
            <>
              {recommendation.error ? (
                 <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{recommendation.error}</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                    <Alert>
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Top Recommendation: Video ID {recommendation.videoId}</AlertTitle>
                        <AlertDescription>
                            <p className="font-semibold mt-2">Reason:</p>
                            <p>{recommendation.reason}</p>
                        </AlertDescription>
                    </Alert>
                    <Button className="w-full">Watch Now</Button>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

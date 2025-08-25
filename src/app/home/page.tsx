
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { VideoFeed } from "@/components/video-feed";
import { getVideoById, getVideos } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";

function HomePageContent() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('videoId');

  let initialVideos;

  if (videoId) {
    const specificVideo = getVideoById(videoId);
    const otherVideos = getVideos(10).filter(v => v.id !== videoId);
    if (specificVideo) {
      initialVideos = [specificVideo, ...otherVideos];
    } else {
      // Fallback if the videoId is invalid
      initialVideos = getVideos(10);
    }
  } else {
    initialVideos = getVideos(10);
  }

  return (
    <div className="h-full w-full">
      <VideoFeed initialVideos={initialVideos} />
    </div>
  );
}

function HomePageFallback() {
    return (
        <div className="relative mx-auto max-w-md h-[calc(100vh-4rem)] overflow-y-auto snap-y snap-mandatory scroll-smooth no-scrollbar">
            <div className="h-full w-full flex-col snap-center flex items-center justify-center p-4">
                <Skeleton className="w-full h-full rounded-xl" />
            </div>
        </div>
    )
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomePageFallback />}>
      <HomePageContent />
    </Suspense>
  );
}

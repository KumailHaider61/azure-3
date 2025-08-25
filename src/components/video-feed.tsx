
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import type { Video } from "@/lib/data";
import { getVideos } from "@/lib/data";
import { VideoItem } from "./video-item";
import { Skeleton } from "./ui/skeleton";

interface VideoFeedProps {
  initialVideos: Video[];
}

export function VideoFeed({ initialVideos }: VideoFeedProps) {
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(
    initialVideos.length > 0 ? initialVideos[0].id : null
  );
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const videoElementsRef = useRef<Map<string, HTMLDivElement>>(new Map());

  const loadMoreVideos = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    // Simulate network delay
    await new Promise((res) => setTimeout(res, 500));
    const newVideos = getVideos(5, videos.length);
    setVideos((prev) => [...prev, ...newVideos]);
    setIsLoading(false);
  }, [isLoading, videos.length]);

  useEffect(() => {
    const options = {
      root: feedRef.current,
      rootMargin: "0px",
      threshold: 0.8, // Trigger when 80% of the video is visible
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const videoId = entry.target.getAttribute('data-video-id');
          if (videoId) {
            setActiveVideoId(videoId);
          }
        }
      });
    };
    
    observer.current = new IntersectionObserver(handleIntersection, options);

    videoElementsRef.current.forEach(videoElement => {
      if (videoElement) {
        observer.current?.observe(videoElement);
      }
    });

    const currentObserver = observer.current;

    return () => {
        videoElementsRef.current.forEach(videoElement => {
            if (videoElement) {
                currentObserver?.unobserve(videoElement);
            }
        });
        currentObserver?.disconnect();
    }
  }, [videos]); // Re-run when videos change to observe new elements

  const lastVideoElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      
      const scrollObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMoreVideos();
          scrollObserver.unobserve(entries[0].target);
        }
      });
      if (node) {
        scrollObserver.observe(node);
      }
    },
    [isLoading, loadMoreVideos]
  );
  
  return (
    <div ref={feedRef} className="relative mx-auto max-w-md h-[calc(100vh-4rem)] overflow-y-auto snap-y snap-mandatory scroll-smooth no-scrollbar">
      {videos.map((video, index) => {
        const refCallback = (el: HTMLDivElement) => {
            if (el) {
                videoElementsRef.current.set(video.id, el);
            } else {
                videoElementsRef.current.delete(video.id);
            }
            if (index === videos.length - 1) {
                lastVideoElementRef(el);
            }
        };

        return (
          <VideoItem
            key={video.id}
            video={video}
            isActive={activeVideoId === video.id}
            ref={refCallback}
          />
        );
      })}
      {isLoading && (
        <div className="h-[calc(100vh-4rem)] w-full flex-col snap-center flex items-center justify-center p-4">
            <Skeleton className="w-full h-full rounded-xl" />
        </div>
      )}
    </div>
  );
}

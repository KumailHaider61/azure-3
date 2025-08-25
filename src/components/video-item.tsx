
"use client";

import React, { useRef, useEffect, useState, forwardRef } from "react";
import type { Video, User, Comment } from "@/lib/data";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Heart, MessageCircle, Share2, Play, Pause, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSessionUser, toggleLikeVideo, isVideoLiked as isVideoLikedAction } from "@/lib/auth";
import { CommentSheet } from "./comment-sheet";
import { useToast } from "@/hooks/use-toast";

interface VideoItemProps {
  video: Video;
  isActive: boolean;
}

export const VideoItem = forwardRef<HTMLDivElement, VideoItemProps>(
  ({ video: initialVideo, isActive }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [video, setVideo] = useState(initialVideo);
    const [isLiked, setIsLiked] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isCommentSheetOpen, setIsCommentSheetOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const sessionUser = getSessionUser();
        setUser(sessionUser);
        if (sessionUser) {
            setIsLiked(isVideoLikedAction(video.id));
        }
    }, [video.id]);

    useEffect(() => {
      const currentVideoRef = videoRef.current;
      if (currentVideoRef) {
        if (isActive) {
          // Play the video if it is active
          const playPromise = currentVideoRef.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              setIsPlaying(true);
            }).catch(error => {
              console.error("Autoplay was prevented:", error);
              // Muting is a common fallback for browsers that block autoplay with sound
              // We'll keep it unmuted as requested but log the error.
              setIsPlaying(false);
            });
          }
        } else {
          // Pause the video if it is not active
          currentVideoRef.pause();
          setIsPlaying(false);
        }
      }
    }, [isActive]);

    const togglePlay = () => {
      if (videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current.play();
          setIsPlaying(true);
        } else {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      }
    };
    
    const formatCount = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num;
    }

    const handleLike = () => {
        if (!user) return;
        const liked = toggleLikeVideo(video.id);
        setIsLiked(liked);
        setVideo(prev => ({
            ...prev,
            likes: liked ? prev.likes + 1 : prev.likes - 1
        }));
    };

    const handleComment = () => {
        setIsCommentSheetOpen(true);
    };

    const handleAddComment = (newCommentText: string) => {
      if (!user) return;
      const newComment: Comment = {
        id: `comment${Date.now()}`,
        text: newCommentText,
        user: {
          name: user.name,
          avatarUrl: user.avatarUrl,
        }
      };
      setVideo(prev => ({
          ...prev,
          commentsData: [...(prev.commentsData || []), newComment],
          comments: (prev.comments || 0) + 1,
      }));
    };

    const handleShare = async () => {
        const videoUrl = `${window.location.origin}/home?videoId=${video.id}`;
        try {
            await navigator.clipboard.writeText(videoUrl);
            toast({
                title: "Link Copied!",
                description: "The video link has been copied to your clipboard.",
            });
        } catch (err) {
            console.error('Failed to copy: ', err);
            toast({
                title: "Copy Failed",
                description: "Could not copy the link. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
      <>
        <div
          ref={ref}
          data-video-id={video.id}
          className="h-full w-full snap-center flex items-center justify-center relative rounded-xl bg-black"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          <video
            ref={videoRef}
            src={video.videoUrl}
            loop
            playsInline
            className="w-full h-full object-contain"
            onClick={togglePlay}
          />
          
          <div className={cn("absolute inset-0 bg-black/20 transition-opacity", isPlaying ? "opacity-0" : "opacity-100")}></div>

          <button onClick={togglePlay} className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all", isPlaying && !showControls ? "opacity-0 scale-150" : "opacity-100 scale-100")}>
              {isPlaying ? <Pause className="w-16 h-16 text-white/50" /> : <Play className="w-16 h-16 text-white/70"/>}
          </button>


          <div className="absolute bottom-4 left-4 text-white w-[calc(100%-6rem)]">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={video.user.avatarUrl} alt={video.user.name} />
                <AvatarFallback>
                  {video.user.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <p className="font-bold">{video.user.name}</p>
              <Button size="sm" variant="secondary" className="h-7">Follow</Button>
            </div>
            <p className="mt-2 text-sm drop-shadow-md">{video.caption}</p>
          </div>

          <div className="absolute right-2 bottom-4 flex flex-col gap-3 items-center text-white">
            <Button variant="ghost" size="icon" className="flex-col h-auto gap-1 text-white hover:text-white" onClick={handleLike}>
              <Heart className={cn("w-8 h-8", isLiked && "fill-red-500 text-red-500")}/>
              <span className="text-xs font-bold">{formatCount(video.likes)}</span>
            </Button>
            <Button variant="ghost" size="icon" className="flex-col h-auto gap-1 text-white hover:text-white" onClick={handleComment}>
              <MessageCircle className="w-8 h-8" />
              <span className="text-xs font-bold">{formatCount(video.comments)}</span>
            </Button>
            <Button variant="ghost" size="icon" className="flex-col h-auto gap-1 text-white hover:text-white" onClick={handleShare}>
              <Copy className="w-8 h-8" />
              <span className="text-xs font-bold">Copy</span>
            </Button>
          </div>
        </div>
        <CommentSheet 
            isOpen={isCommentSheetOpen}
            onOpenChange={setIsCommentSheetOpen}
            comments={video.commentsData || []}
            commentCount={video.comments}
            onAddComment={handleAddComment}
        />
      </>
    );
  }
);

VideoItem.displayName = "VideoItem";

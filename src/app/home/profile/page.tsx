
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserVideos, type User, type Video as VideoType } from "@/lib/data";
import { Video, Heart } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { EditProfileDialog } from "@/components/edit-profile-dialog";

function VideoGridItem({ video }: { video: VideoType }) {
  return (
    <Card className="overflow-hidden group relative aspect-[3/4]">
      <video
        src={video.videoUrl}
        playsInline
        muted
        loop
        onMouseOver={e => e.currentTarget.play()}
        onMouseOut={e => e.currentTarget.pause()}
        className="object-cover w-full h-full"
        preload="metadata"
      />
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
        <div className="text-white text-xs flex items-center gap-1 font-bold">
          <Heart className="w-4 h-4" fill="white" stroke="white" />
          {video.likes > 1000
            ? `${(video.likes / 1000).toFixed(1)}K`
            : video.likes}
        </div>
      </div>
    </Card>
  );
}


export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const sessionUser = getSessionUser();
    if (sessionUser) {
      setUser(sessionUser);
    } else {
      router.push('/login');
    }
  }, [router]);

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6 max-w-4xl">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <Skeleton className="w-32 h-32 rounded-full border-4" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full" />
            <div className="flex items-center gap-6 mt-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-10 w-28 mt-4" />
          </div>
        </div>
      </div>
    );
  }

  const handleProfileUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const userVideos = getUserVideos(user.id);
  const likedVideos = user.likedVideos.map(videoId => getUserVideos(user.id).find(v => v.id === videoId)).filter(Boolean) as VideoType[];

  return (
    <>
      <div className="container mx-auto py-8 px-4 md:px-6 max-w-4xl">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <Avatar className="w-32 h-32 border-4 border-primary">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground mt-1">{user.bio}</p>
            <div className="flex items-center gap-6 mt-4">
              <div>
                <span className="font-bold">{user.following}</span>
                <span className="text-muted-foreground ml-1">Following</span>
              </div>
              <div>
                <span className="font-bold">{user.followers}</span>
                <span className="text-muted-foreground ml-1">Followers</span>
              </div>
              <div>
                <span className="font-bold">{user.likes}</span>
                <span className="text-muted-foreground ml-1">Likes</span>
              </div>
            </div>
            <Button className="mt-4" onClick={() => setIsEditDialogOpen(true)}>Edit Profile</Button>
          </div>
        </div>

        <Tabs defaultValue="videos" className="mt-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="videos">
              <Video className="mr-2 h-4 w-4" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="liked">
              <Heart className="mr-2 h-4 w-4" />
              Liked
            </TabsTrigger>
          </TabsList>
          <TabsContent value="videos">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
              {userVideos.map((video) => (
                <Link href={`/home?videoId=${video.id}`} key={`uploaded-${video.id}`} className="block">
                  <VideoGridItem video={video} />
                </Link>
              ))}
              {userVideos.length === 0 && (
                  <div className="col-span-full text-center py-16">
                      <p className="text-muted-foreground">No videos uploaded yet.</p>
                  </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="liked">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
              {likedVideos.map((video) => (
                <Link href={`/home?videoId=${video.id}`} key={`liked-${video.id}`} className="block">
                    <VideoGridItem video={video} />
                </Link>
              ))}
              {likedVideos.length === 0 && (
                  <div className="col-span-full text-center py-16">
                      <p className="text-muted-foreground">Liked videos will appear here.</p>
                  </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      {user && (
        <EditProfileDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          user={user}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
    </>
  );
}


"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UploadCloud, Film, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';
import { getSessionUser } from "@/lib/auth";
import { addVideo } from "@/lib/data";

export default function UploadPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [videoDataUrl, setVideoDataUrl] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleFileSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      setIsProcessing(true);
      setVideoFile(file);
      
      // Create a temporary object URL for previewing
      const tempVideoUrl = URL.createObjectURL(file);

      // Generate thumbnail
      const videoElement = document.createElement('video');
      videoElement.src = tempVideoUrl;
      videoElement.currentTime = 1;
      videoElement.onloadeddata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          setThumbnailUrl(canvas.toDataURL('image/jpeg'));
        }
      };

      // Read the file as a Data URI for persistent storage
      const reader = new FileReader();
      reader.onload = (e) => {
        setVideoDataUrl(e.target?.result as string);
        setIsProcessing(false);
        URL.revokeObjectURL(tempVideoUrl); // Clean up the temporary URL
      };
      reader.onerror = () => {
        setIsProcessing(false);
        toast({
          title: "Error Reading File",
          description: "Could not process the selected video.",
          variant: "destructive",
        });
      }
      reader.readAsDataURL(file);

    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid video file.",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async () => {
    const user = getSessionUser();
    if (!videoDataUrl || !videoFile || !user) {
      toast({
        title: "Upload Failed",
        description: !user ? "You must be logged in to upload." : "Please select and process a video to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    // In a real app, you would upload the file to cloud storage.
    // Here, we use the Data URI which is now stored in videoDataUrl.
    addVideo({
      userId: user.id,
      caption,
      videoUrl: videoDataUrl,
    });

    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

    toast({
      title: "Upload Successful!",
      description: "Your video has been published.",
    });

    // Reset form and navigate to profile
    setVideoFile(null);
    setCaption("");
    setThumbnailUrl(null);
    setVideoDataUrl(null);
    setIsUploading(false);
    router.push('/home/profile');
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Upload Video</CardTitle>
          <CardDescription>Share your next viral clip with the world.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg text-center aspect-video relative">
              <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="video/*"
                disabled={isProcessing}
              />
              {isProcessing ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-16 h-16 text-muted-foreground animate-spin" />
                  <p className="text-muted-foreground">Processing video...</p>
                </div>
              ) : videoFile && videoDataUrl ? (
                <div className="space-y-2">
                    <video src={videoDataUrl} className="w-full h-auto rounded-md" controls />
                    <p className="text-sm text-muted-foreground truncate">{videoFile.name}</p>
                    <Button variant="outline" size="sm" onClick={handleFileSelectClick}>Change video</Button>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-16 h-16 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Drag and drop video files to upload</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Your videos will be private until you publish them.</p>
                  <Button className="mt-4" onClick={handleFileSelectClick}>Select files</Button>
                </>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="caption">Caption</Label>
                <Textarea id="caption" placeholder="Add a creative caption..." className="min-h-[100px]" value={caption} onChange={(e) => setCaption(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="thumbnail">Cover</Label>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  {thumbnailUrl ? (
                    <Image src={thumbnailUrl} alt="Video thumbnail" width={1280} height={720} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <div className="text-center text-muted-foreground">
                        <Film className="mx-auto h-12 w-12" />
                        <p className="text-sm">Thumbnail preview</p>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <Button className="w-full" size="lg" onClick={handleUpload} disabled={isUploading || isProcessing || !videoDataUrl}>
                  {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isUploading ? "Uploading..." : "Upload & Publish"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

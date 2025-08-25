
"use client";

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Comment } from "@/lib/data";
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Send } from 'lucide-react';

interface CommentSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  comments: Comment[];
  commentCount: number;
  onAddComment: (comment: string) => void;
}

export function CommentSheet({ isOpen, onOpenChange, comments, commentCount, onAddComment }: CommentSheetProps) {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
        onAddComment(newComment.trim());
        setNewComment("");
    }
  };
    
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[75vh] flex flex-col">
        <SheetHeader className="text-center">
          <SheetTitle>{commentCount} Comments</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 my-4">
            <div className="space-y-4 px-4">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={comment.user.avatarUrl} alt={comment.user.name} />
                                <AvatarFallback>{comment.user.name.substring(0,2)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">{comment.user.name}</p>
                                <p className="text-sm">{comment.text}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-muted-foreground py-8">
                        <p>No comments yet.</p>
                        <p className="text-xs">Be the first to comment!</p>
                    </div>
                )}
            </div>
        </ScrollArea>
        <SheetFooter>
            <form onSubmit={handleSubmit} className="w-full flex items-center gap-2 p-2 border-t">
                <Input 
                    placeholder="Add a comment..." 
                    className="flex-1"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <Button type="submit" size="icon" disabled={!newComment.trim()}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send comment</span>
                </Button>
            </form>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

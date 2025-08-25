
import { SidebarTrigger } from "@/components/ui/sidebar";
import { PlayCircle } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <Link href="/home" className="flex items-center gap-2 font-semibold">
          <PlayCircle className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline-block">Echo Chamber</span>
        </Link>
      </div>

      <div className="flex-1 max-w-lg">
        <Input placeholder="Search..." />
      </div>

      <div>
        <Button asChild>
            <Link href="/home/upload">Upload</Link>
        </Button>
      </div>
    </header>
  );
}


"use client";

import React from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Home,
  PlayCircle,
  Upload,
  User,
  WandSparkles,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { RecommendedVideoDialog } from "../recommended-video-dialog";
import { logout } from "@/lib/auth";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <>
      <Sidebar side="left" collapsible="icon" variant="sidebar">
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <PlayCircle className="h-8 w-8 text-primary" />
            <span className="font-semibold text-lg whitespace-nowrap">
              Echo Chamber
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/home"}
                tooltip={{ children: "Home" }}
              >
                <Link href="/home">
                  <Home />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setIsDialogOpen(true)}
                tooltip={{ children: "Recommended" }}
              >
                <WandSparkles />
                <span>Recommended</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/home/upload"}
                tooltip={{ children: "Upload" }}
              >
                <Link href="/home/upload">
                  <Upload />
                  <span>Upload</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/home/profile"}
                tooltip={{ children: "Profile" }}
              >
                <Link href="/home/profile">
                  <User />
                  <span>Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                tooltip={{ children: "Logout" }}
              >
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <p className="text-xs text-muted-foreground p-4 text-center group-data-[collapsible=icon]:hidden">
            © 2024 Echo Chamber
          </p>
        </SidebarFooter>
      </Sidebar>
      <RecommendedVideoDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}

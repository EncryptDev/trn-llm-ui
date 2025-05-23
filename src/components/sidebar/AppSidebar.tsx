import { ArrowBigLeft, Home, Upload } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import Link from "next/link";

const items = [
    {
        title: "Materi",
        url: "/admin/materi",
        icon: Home
    },
    {
        title: "Upload",
        url: "/admin/upload",
        icon: Upload
    },
    {
        title: "Back",
        url: "/",
        icon: ArrowBigLeft
    }
]

export default function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
                    <SidebarContent className="list-none">
                        {items.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    <Link href={item.url}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}
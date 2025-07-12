"use client"

import type * as React from "react"
import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Code,
  DollarSign,
  Building,
  Zap,
  Palette,
  Briefcase,
  TrendingUp,
  Rocket,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"

// This is sample data with updated categories
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Stackit Community",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Technology",
      url: "#",
      icon: Code,
      isActive: true,
      items: [
        {
          title: "Web Development",
          url: "#",
        },
        {
          title: "Mobile Development",
          url: "#",
        },
        {
          title: "Data Science",
          url: "#",
        },
        {
          title: "DevOps",
          url: "#",
        },
      ],
    },
    {
      title: "Finance",
      url: "#",
      icon: DollarSign,
      items: [
        {
          title: "FinTech",
          url: "#",
        },
        {
          title: "Cryptocurrency",
          url: "#",
        },
        {
          title: "Investment",
          url: "#",
        },
        {
          title: "Banking",
          url: "#",
        },
      ],
    },
    {
      title: "Industry",
      url: "#",
      icon: Building,
      items: [
        {
          title: "Manufacturing",
          url: "#",
        },
        {
          title: "Healthcare",
          url: "#",
        },
        {
          title: "Education",
          url: "#",
        },
        {
          title: "Retail",
          url: "#",
        },
      ],
    },
    {
      title: "SaaS Products",
      url: "#",
      icon: Zap,
      items: [
        {
          title: "CRM Systems",
          url: "#",
        },
        {
          title: "Project Management",
          url: "#",
        },
        {
          title: "Analytics Tools",
          url: "#",
        },
        {
          title: "Communication",
          url: "#",
        },
      ],
    },
    {
      title: "Design & UX",
      url: "#",
      icon: Palette,
      items: [
        {
          title: "UI Design",
          url: "#",
        },
        {
          title: "UX Research",
          url: "#",
        },
        {
          title: "Design Systems",
          url: "#",
        },
        {
          title: "Prototyping",
          url: "#",
        },
      ],
    },
    {
      title: "Business",
      url: "#",
      icon: Briefcase,
      items: [
        {
          title: "Strategy",
          url: "#",
        },
        {
          title: "Operations",
          url: "#",
        },
        {
          title: "Legal",
          url: "#",
        },
        {
          title: "HR",
          url: "#",
        },
      ],
    },
    {
      title: "Marketing",
      url: "#",
      icon: TrendingUp,
      items: [
        {
          title: "Digital Marketing",
          url: "#",
        },
        {
          title: "Content Strategy",
          url: "#",
        },
        {
          title: "SEO",
          url: "#",
        },
        {
          title: "Social Media",
          url: "#",
        },
      ],
    },
    {
      title: "Startups",
      url: "#",
      icon: Rocket,
      items: [
        {
          title: "Funding",
          url: "#",
        },
        {
          title: "Product Launch",
          url: "#",
        },
        {
          title: "Growth Hacking",
          url: "#",
        },
        {
          title: "Team Building",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

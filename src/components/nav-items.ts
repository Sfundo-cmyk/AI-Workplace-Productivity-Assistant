import {
  LayoutDashboard,
  Mail,
  NotebookPen,
  CalendarCheck,
  Telescope,
  MessagesSquare,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  to: string;
  label: string;
  short: string;
  description: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  {
    to: "/",
    label: "Dashboard",
    short: "Dashboard",
    description: "Your workspace overview and quick access to every tool.",
    icon: LayoutDashboard,
  },
  {
    to: "/email",
    label: "Smart Email Generator",
    short: "Email",
    description: "Turn a few bullet points into a polished, ready-to-send email.",
    icon: Mail,
  },
  {
    to: "/meetings",
    label: "Meeting Notes Summarizer",
    short: "Meetings",
    description: "Extract decisions, action items and deadlines from messy notes.",
    icon: NotebookPen,
  },
  {
    to: "/planner",
    label: "AI Task Planner",
    short: "Planner",
    description: "Prioritize your task list into a realistic daily or weekly plan.",
    icon: CalendarCheck,
  },
  {
    to: "/research",
    label: "AI Research Assistant",
    short: "Research",
    description: "Condense a topic or long article into insights and next steps.",
    icon: Telescope,
  },
  {
    to: "/chat",
    label: "AI Chatbot",
    short: "Chat",
    description: "Ask quick workplace questions and get practical answers.",
    icon: MessagesSquare,
  },
];

import {
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Globe,
  BookOpen,
  Lightbulb,
} from "lucide-react";
import { XIcon, TikTokIcon } from "~/lib/icons";
import type { TranslationType } from "~/services/translations/social-media";

export interface ChannelConfig {
  name: string;
  url: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

export interface FacultyChannelConfig {
  title: string;
  url: string;
  icon: any;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  tag: string;
}

export const getOfficialChannels = (t: TranslationType): ChannelConfig[] => [
  {
    name: "Instagram (IU Internationale Hochschule)",
    url: "https://www.instagram.com/iu.internationale.hochschule/",
    icon: Instagram,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/20",
    description: t.channels.instagram,
  },
  {
    name: "Instagram (IU Career)",
    url: "https://www.instagram.com/iu.career/",
    icon: Instagram,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/20",
    description: t.channels.instagramCareer,
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/school/iu-internationale-hochschule/",
    icon: Linkedin,
    color: "text-blue-600",
    bgColor: "bg-blue-600/10",
    borderColor: "border-blue-600/20",
    description: t.channels.linkedin,
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/iu.internationale.hochschule",
    icon: Facebook,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    description: t.channels.facebook,
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/c/IUInternationaleHochschule",
    icon: Youtube,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    description: t.channels.youtube,
  },
  {
    name: "X (Twitter)",
    url: "https://twitter.com/IUdualesstudium",
    icon: XIcon,
    color: "text-foreground",
    bgColor: "bg-foreground/5",
    borderColor: "border-foreground/10",
    description: t.channels.twitter,
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@iu.hochschule",
    icon: TikTokIcon,
    color: "text-foreground",
    bgColor: "bg-foreground/5",
    borderColor: "border-foreground/10",
    description: t.channels.tiktok,
  },
  {
    name: "IU Website",
    url: "https://www.iu.de/",
    icon: Globe,
    color: "text-iu-blue",
    bgColor: "bg-iu-blue/10",
    borderColor: "border-iu-blue/20",
    description: t.channels.website,
  },
];

export const getFacultyChannels = (
  t: TranslationType
): FacultyChannelConfig[] => [
  {
    title: "Studium Unplugged",
    url: "https://www.instagram.com/studium_unplugged?igsh=MWlsOWVvZndlbGs3aA==",
    icon: Instagram,
    description: t.faculty.unplugged,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/20",
    tag: t.tags.instagram,
  },
  {
    title: t.academicWriting,
    url: "#",
    icon: BookOpen,
    description: t.faculty.wissenschaftlich,
    color: "text-iu-blue",
    bgColor: "bg-iu-blue/10",
    borderColor: "border-iu-blue/20",
    tag: t.tags.learning,
  },
  {
    title: t.mathSupport,
    url: "#",
    icon: Lightbulb,
    description: t.faculty.mathe,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    tag: t.tags.course,
  },
];

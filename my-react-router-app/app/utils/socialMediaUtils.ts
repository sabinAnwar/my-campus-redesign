import {
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Globe,
  BookOpen,
  Lightbulb,
} from "lucide-react";
import { XIcon, TikTokIcon } from "~/utils/icons";
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
    color: "text-iu-pink dark:text-white",
    bgColor: "bg-iu-pink/10 dark:bg-iu-pink",
    borderColor: "border-iu-pink/30 dark:border-iu-pink",
    description: t.channels.instagram,
  },
  {
    name: "Instagram (IU Career)",
    url: "https://www.instagram.com/iu.career/",
    icon: Instagram,
    color: "text-iu-purple dark:text-white",
    bgColor: "bg-iu-purple/10 dark:bg-iu-purple",
    borderColor: "border-iu-purple/30 dark:border-iu-purple",
    description: t.channels.instagramCareer,
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/school/iu-internationale-hochschule/",
    icon: Linkedin,
    color: "text-iu-blue dark:text-white",
    bgColor: "bg-iu-blue/10 dark:bg-iu-blue",
    borderColor: "border-iu-blue/30 dark:border-iu-blue",
    description: t.channels.linkedin,
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/iu.internationale.hochschule",
    icon: Facebook,
    color: "text-iu-blue dark:text-white",
    bgColor: "bg-iu-blue/10 dark:bg-iu-blue",
    borderColor: "border-iu-blue/30 dark:border-iu-blue",
    description: t.channels.facebook,
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/c/IUInternationaleHochschule",
    icon: Youtube,
    color: "text-iu-red dark:text-white",
    bgColor: "bg-iu-red/10 dark:bg-iu-red",
    borderColor: "border-iu-red/30 dark:border-iu-red",
    description: t.channels.youtube,
  },
  {
    name: "X (Twitter)",
    url: "https://twitter.com/IUdualesstudium",
    icon: XIcon,
    color: "text-foreground",
    bgColor: "bg-muted",
    borderColor: "border-border",
    description: t.channels.twitter,
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@iu.hochschule",
    icon: TikTokIcon,
    color: "text-foreground",
    bgColor: "bg-muted",
    borderColor: "border-border",
    description: t.channels.tiktok,
  },
  {
    name: "IU Website",
    url: "https://www.iu.de/",
    icon: Globe,
    color: "text-iu-blue dark:text-white",
    bgColor: "bg-iu-blue/10 dark:bg-iu-blue",
    borderColor: "border-iu-blue/30 dark:border-iu-blue",
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
    color: "text-iu-pink dark:text-white",
    bgColor: "bg-iu-pink/10 dark:bg-iu-pink",
    borderColor: "border-iu-pink/30 dark:border-iu-pink",
    tag: t.tags.instagram,
  },
  {
    title: t.academicWriting,
    url: "#",
    icon: BookOpen,
    description: t.faculty.wissenschaftlich,
    color: "text-iu-blue dark:text-white",
    bgColor: "bg-iu-blue/10 dark:bg-iu-blue",
    borderColor: "border-iu-blue/30 dark:border-iu-blue",
    tag: t.tags.learning,
  },
  {
    title: t.mathSupport,
    url: "#",
    icon: Lightbulb,
    description: t.faculty.mathe,
    color: "text-iu-orange dark:text-white",
    bgColor: "bg-iu-orange/10 dark:bg-iu-orange",
    borderColor: "border-iu-orange/30 dark:border-iu-orange",
    tag: t.tags.course,
  },
];

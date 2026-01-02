export interface BenefitTool {
  name: string;
  description: string;
  url: string;
  support?: string;
  alt?: string;
  logo: { text: string; bg: string };
  featured?: boolean;
}

export type FeaturedTool = BenefitTool & { category: string };

export interface ToolCategory {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  gradient: string;
  tools: BenefitTool[];
}

export interface BenefitTool {
  name: string;
  description: string;
  url: string;
  support?: string;
  alt?: string;
  logo: { text: string; bg: string };
  featured?: boolean;
}

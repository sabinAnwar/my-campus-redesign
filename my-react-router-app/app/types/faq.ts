export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords?: string;
}

export interface ChatMessage {
  text: string;
  isUser: boolean;
}

export interface FeatureCard {
  title: string;
  body: string;
  iconName: string;
  delay: string;
}

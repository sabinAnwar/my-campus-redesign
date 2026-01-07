import { LucideIcon, Presentation, Trophy, Users } from "lucide-react";
import { Globe, Linkedin } from "lucide-react";
import { ChannelConfig, FacultyChannelConfig } from "~/lib/socialMediaUtils";

interface AlumniConnectProps {
  title: string;
  description: string;
  registerText: string;
  linkedinText: string;
}

interface SocialMediaHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  iconBg?: string;
  iconColor?: string;
}


interface ChannelCardProps {
  channel: ChannelConfig;
}

interface BrandAmbassadorProps {
  title: string;
  description: string;
  whatAwaitsTitle: string;
  whatAwaitsDesc: string;
  yourProfileTitle: string;
  yourProfileDesc: string;
  interestedText: string;
}

export const BrandAmbassador = ({
  title,
  description,
  whatAwaitsTitle,
  whatAwaitsDesc,
  yourProfileTitle,
  yourProfileDesc,
  interestedText,
}: BrandAmbassadorProps) => {
  return (
    <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 md:p-10 flex flex-col hover:border-iu-purple/30 transition-all duration-500 group">
      <div className="mb-6 sm:mb-8 md:mb-12">
        <h3 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3 text-foreground">
          <Presentation size={20} className="text-iu-purple dark:text-white sm:w-6 sm:h-6" />
          {title}
        </h3>
        <p className="text-muted-foreground font-medium text-sm sm:text-base leading-relaxed">
          {description}
        </p>
      </div>

      <div className="space-y-6 sm:space-y-8 md:space-y-10 flex-1">
        <div className="flex gap-4 sm:gap-6">
          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-iu-purple/10 dark:bg-iu-purple text-iu-purple dark:text-white h-fit shrink-0">
            <Users size={20} className="sm:w-6 sm:h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-lg text-foreground">
              {whatAwaitsTitle}
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-2 leading-relaxed">
              {whatAwaitsDesc}
            </p>
          </div>
        </div>

        <div className="flex gap-4 sm:gap-6">
          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-iu-purple/10 dark:bg-iu-purple text-iu-purple dark:text-white h-fit shrink-0">
            <Globe size={20} className="sm:w-6 sm:h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-lg text-foreground">
              {yourProfileTitle}
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-2 leading-relaxed">
              {yourProfileDesc}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 md:pt-10 border-t border-border">
        <p className="text-[10px] sm:text-xs font-black text-muted-foreground uppercase tracking-widest sm:tracking-[0.2em] mb-4 sm:mb-6">
          {interestedText}
        </p>
        <a
          href="mailto:micro-affiliate@iu.org"
          className="block w-full text-center py-4 sm:py-5 bg-foreground text-background hover:bg-iu-purple hover:text-white font-bold rounded-2xl transition-all duration-300 uppercase tracking-widest text-xs sm:text-sm shadow-xl"
        >
          micro-affiliate@iu.org
        </a>
      </div>
    </div>
  );
};

interface FacultyCardProps {
  channel: FacultyChannelConfig;
  toChannelText: string;
}
interface DiscountCardProps {
  title: string;
  code: string;
  note: string;
}


interface AlumniDiscountsProps {
  title: string;
  masterDiscount: string;
  masterDiscountNote: string;
  trainingDiscount: string;
  trainingDiscountNote: string;
}

export const AlumniDiscounts = ({
  title,
  masterDiscount,
  masterDiscountNote,
  trainingDiscount,
  trainingDiscountNote,
}: AlumniDiscountsProps) => {
  return (
    <div className="bg-iu-blue/5 dark:bg-iu-blue/10 border border-iu-blue/20 dark:border-iu-blue/30 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 md:p-10 relative overflow-hidden group">
      <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-iu-blue/10 blur-[40px] rounded-full" />

      <h3 className="text-base sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 md:mb-8 flex items-center gap-2 sm:gap-3 text-iu-blue dark:text-white relative z-10">
        <div className="p-2 rounded-xl bg-iu-blue/10 dark:bg-iu-blue">
          <Trophy size={20} className="sm:w-6 sm:h-6" />
        </div>
        {title}
      </h3>

      <div className="space-y-4 relative z-10">
        <DiscountCard
          title={masterDiscount}
          code="Koopalumni"
          note={masterDiscountNote}
        />
        <DiscountCard
          title={trainingDiscount}
          code="ALUMNIUPS10"
          note={trainingDiscountNote}
        />
      </div>
    </div>
  );
};

export const DiscountCard = ({ title, code, note }: DiscountCardProps) => {
  return (
    <div className="bg-background/50 backdrop-blur-xl border border-iu-blue/20 rounded-3xl p-6 shadow-xl group-hover:border-iu-blue transition-colors duration-500">
      <div className="flex justify-between items-start mb-2">
        <span className="font-bold text-base sm:text-lg text-foreground">{title}</span>
        <span className="bg-iu-blue/10 dark:bg-iu-blue text-iu-blue dark:text-white border border-iu-blue/30 dark:border-iu-blue text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest">
          {code}
        </span>
      </div>
      <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">{note}</p>
    </div>
  );
};

export const FacultyCard = ({ channel, toChannelText }: FacultyCardProps) => {
  return (
    <a
      href={channel.url}
      target={channel.url.startsWith("http") ? "_blank" : undefined}
      rel={channel.url.startsWith("http") ? "noopener noreferrer" : undefined}
      className="bg-background/50 backdrop-blur-xl border border-border rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-5 sm:p-6 md:p-8 hover:border-iu-purple/30 transition-all duration-500 group block"
    >
      <div className="flex justify-between items-start mb-4 sm:mb-6 md:mb-8">
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl border ${channel.borderColor} ${channel.bgColor} ${channel.color} flex items-center justify-center`}
        >
          <channel.icon size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7" />
        </div>
        <span className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-full bg-muted/50 text-[8px] sm:text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-wider sm:tracking-widest border border-border shrink-0">
          {channel.tag}
        </span>
      </div>
      <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-foreground mb-2 sm:mb-3 group-hover:text-iu-purple dark:group-hover:text-white transition-colors break-words hyphens-auto">
        {channel.title}
      </h3>
      <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-4 sm:mb-6 md:mb-8 leading-relaxed line-clamp-3">
        {channel.description}
      </p>
      <div className="flex items-center text-xs sm:text-sm font-bold text-iu-purple dark:text-white uppercase tracking-wider sm:tracking-widest group-hover:translate-x-2 transition-transform">
        {toChannelText} <span className="ml-2">→</span>
      </div>
    </a>
  );
};
export const ChannelCard = ({ channel }: ChannelCardProps) => {
  return (
    <a
      href={channel.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] bg-card/50 backdrop-blur-xl border border-border hover:border-iu-blue/30 transition-all duration-500 flex flex-col"
    >
      <div className="flex items-start justify-between mb-4 sm:mb-6 md:mb-8">
        <div
          className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border ${channel.borderColor} ${channel.bgColor} ${channel.color} group-hover:scale-110 transition-transform duration-500`}
        >
          <channel.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
        </div>
        <div className="p-2 rounded-full bg-muted/50 text-muted-foreground group-hover:bg-iu-blue group-hover:text-white transition-all duration-500">
          <Globe size={16} />
        </div>
      </div>
      <h3 className="text-sm sm:text-lg font-bold text-foreground mb-2 sm:mb-3 leading-tight group-hover:text-iu-blue dark:group-hover:text-white transition-colors line-clamp-2">
        {channel.name}
      </h3>
      <p className="text-[10px] sm:text-sm text-muted-foreground font-medium leading-relaxed flex-1 line-clamp-3">
        {channel.description}
      </p>
    </a>
  );
};

export const SocialMediaHeader = ({
  icon: Icon,
  title,
  subtitle,
  iconBg = "bg-iu-blue/10 dark:bg-iu-blue",
  iconColor = "text-iu-blue dark:text-white",
}: SocialMediaHeaderProps) => {
  return (
    <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-12">
      <div className={`p-2.5 sm:p-3 rounded-2xl ${iconBg} ${iconColor}`}>
        <Icon size={24} />
      </div>
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{title}</h2>
        <p className="text-xs sm:text-sm text-muted-foreground font-medium">{subtitle}</p>
      </div>
    </div>
  );
};
export function AlumniConnect({
  title,
  description,
  registerText,
  linkedinText,
}: AlumniConnectProps) {
  return (
    <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 md:p-10 hover:border-iu-blue/30 transition-all duration-500 group">
      <h3 className="text-base sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 text-foreground">
        <Globe size={20} className="text-iu-blue dark:text-white sm:w-6 sm:h-6" />
        {title}
      </h3>
      <p className="text-muted-foreground font-medium text-xs sm:text-base mb-6 sm:mb-8 md:mb-10 leading-relaxed">
        {description}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <a
          href="https://connect.iu.de/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-iu-blue hover:bg-iu-blue/90 text-white rounded-xl sm:rounded-2xl text-sm font-bold transition-all duration-300 shadow-lg shadow-iu-blue/20"
        >
          {registerText}
        </a>
        <a
          href="https://www.linkedin.com/groups/152020/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-[#0077b5] hover:bg-[#0077b5]/90 text-white rounded-xl sm:rounded-2xl text-sm font-bold transition-all duration-300 shadow-lg shadow-[#0077b5]/20"
        >
          <Linkedin size={20} />
          {linkedinText}
        </a>
      </div>
    </div>
  );
}

export const XIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

export const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

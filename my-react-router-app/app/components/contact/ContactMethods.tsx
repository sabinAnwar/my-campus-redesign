import { Phone, Mail, MessageSquare } from "lucide-react";

interface ContactMethodsProps {
  t: any;
}

export function ContactMethods({ t }: ContactMethodsProps) {
  return (
    <div className="bg-card/60 backdrop-blur-xl border border-border sm:rounded-[2.5rem] rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-border/50">
        <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-iu-blue/10 dark:bg-iu-blue text-iu-blue dark:text-white shadow-sm border border-iu-blue/10 shrink-0">
          <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <h3 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
          {t.chatTitle}
        </h3>
      </div>
      <div className="space-y-4 sm:space-y-6">
        <MethodItem 
          icon={<Mail className="w-4 h-4 sm:w-5 sm:h-5" />} 
          label="E-Mail" 
          value="support@iu-study.org" 
          href="mailto:support@iu-study.org" 
        />
        <MethodItem 
          icon={<Phone className="w-4 h-4 sm:w-5 sm:h-5" />} 
          label="Telefon" 
          value="+49 40 1234 5678" 
          href="tel:+4940123456789" 
        />
        <MethodItem 
          icon={<MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />} 
          label="WhatsApp" 
          value="+49 40 1234 5678" 
          href="https://wa.me/4940123456789" 
          isSpecial
        />
      </div>
    </div>
  );
}

function MethodItem({ icon, label, value, href, isSpecial = false }: { icon: React.ReactNode; label: string; value: string; href: string; isSpecial?: boolean }) {
  return (
    <div className={`group p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-border hover:border-iu-blue/30 hover:bg-card hover:shadow-2xl transition-all duration-500 ${isSpecial ? "bg-iu-blue/5 border-iu-blue/10" : "bg-background/50"}`}>
      <div className="flex items-center gap-3 mb-2 sm:mb-3">
        <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-iu-blue/10 dark:bg-iu-blue text-iu-blue dark:text-white group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <p className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">
          {label}
        </p>
      </div>
      <a
        href={href}
        className="text-base sm:text-lg font-bold text-foreground group-hover:text-iu-blue dark:group-hover:text-white transition-colors break-all leading-tight block"
      >
        {value}
      </a>
    </div>
  );
}

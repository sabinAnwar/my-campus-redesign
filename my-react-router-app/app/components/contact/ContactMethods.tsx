import { Phone, Mail, MessageSquare } from "lucide-react";

interface ContactMethodsProps {
  t: any;
}

export function ContactMethods({ t }: ContactMethodsProps) {
  return (
    <div className="bg-card/60 backdrop-blur-xl border border-border rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border/50">
        <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm border border-iu-blue/10">
          <Phone className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-black text-foreground tracking-tight">
          {t.chatTitle}
        </h3>
      </div>
      <div className="space-y-6">
        <MethodItem 
          icon={<Mail className="w-5 h-5" />} 
          label="E-Mail" 
          value="support@iu-study.org" 
          href="mailto:support@iu-study.org" 
        />
        <MethodItem 
          icon={<Phone className="w-5 h-5" />} 
          label="Telefon" 
          value="+49 40 1234 5678" 
          href="tel:+4940123456789" 
        />
        <MethodItem 
          icon={<MessageSquare className="w-5 h-5" />} 
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
    <div className={`group p-6 rounded-3xl border border-border hover:border-iu-blue/30 hover:bg-card hover:shadow-2xl transition-all duration-500 ${isSpecial ? "bg-iu-blue/5 border-iu-blue/10" : "bg-background/50"}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-xl bg-iu-blue/10 text-iu-blue group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
          {label}
        </p>
      </div>
      <a
        href={href}
        className="text-lg font-bold text-foreground group-hover:text-iu-blue transition-colors break-all"
      >
        {value}
      </a>
    </div>
  );
}

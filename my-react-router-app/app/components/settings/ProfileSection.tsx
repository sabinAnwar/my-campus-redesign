import { User, Mail, Shield } from "lucide-react";

interface ProfileSectionProps {
  userName: string;
  userEmail: string;
  labels: {
    personalData: string;
    securelyStored: string;
    name: string;
    email: string;
  };
}

export function ProfileSection({ userName, userEmail, labels }: ProfileSectionProps) {
  return (
    <section className="lg:col-span-2 bg-card/60 backdrop-blur-xl rounded-[2.5rem] border border-border p-10 shadow-2xl relative overflow-hidden group">
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-iu-blue/5 blur-3xl rounded-full group-hover:bg-iu-blue/10 transition-colors" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-iu-blue/10 dark:bg-iu-blue text-iu-blue dark:text-white shadow-sm border border-iu-blue/10 dark:border-iu-blue">
              <User className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-foreground tracking-tight">
              {labels.personalData}
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-iu-blue/10 dark:bg-iu-blue border border-iu-blue/20 dark:border-iu-blue text-iu-blue dark:text-white text-xs font-bold">
            <Shield className="w-3.5 h-3.5" />
            {labels.securelyStored}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
              {labels.name}
            </label>
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-4 flex items-center text-muted-foreground group-focus-within/input:text-iu-blue transition-colors">
                <User className="w-4 h-4" />
              </div>
              <input
                className="w-full bg-background/50 border border-border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-iu-blue/20 focus:border-iu-blue transition-all"
                value={userName || ""}
                readOnly
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
              {labels.email}
            </label>
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-4 flex items-center text-muted-foreground group-focus-within/input:text-iu-blue transition-colors">
                <Mail className="w-4 h-4" />
              </div>
              <input
                className="w-full bg-background/50 border border-border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-iu-blue/20 focus:border-iu-blue transition-all"
                value={userEmail || ""}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

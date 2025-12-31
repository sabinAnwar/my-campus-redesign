import { Shield, Lock, Key, RefreshCw, Mail, Smartphone, Database, FileWarning, Users, ShieldAlert } from "lucide-react";
import { useLanguage } from "~/contexts/LanguageContext";

// ────────────────────────────────────────────────────────────────────────────
// TRANSLATIONS
// ────────────────────────────────────────────────────────────────────────────
const TRANSLATIONS = {
  de: {
    title: "Informationssicherheit & Datenschutz",
    subtitle: "Die 8 goldenen Regeln für den sicheren Umgang mit Daten und Systemen an der IU.",
    rule: "Regel",
    reportIncident: "Sicherheitsvorfall melden?",
    reportIncidentDesc: "Bei Verdacht auf Datenverlust, Phishing oder andere Sicherheitsvorfälle wende dich bitte umgehend an den IT-Support oder den Datenschutzbeauftragten unter",
    guidelines: [
      {
        id: "01",
        title: "Social Engineering",
        description: "Sei wachsam bei Manipulationsversuchen. Gib keine vertraulichen Informationen an Unbekannte weiter, auch wenn diese autoritär oder hilfsbereit wirken.",
      },
      {
        id: "02",
        title: "Passwort-Diebstahl",
        description: "Schütze dich vor Phishing. Prüfe Absender und Links genau. Die IU wird dich niemals nach deinem Passwort fragen.",
      },
      {
        id: "03",
        title: "Sicheres Passwort",
        description: "Nutze starke Passwörter: Mindestens 12 Zeichen, Mix aus Groß-/Kleinbuchstaben, Zahlen & Sonderzeichen. Verwende für jeden Dienst ein eigenes Passwort.",
      },
      {
        id: "04",
        title: "Virenschutz & Updates",
        description: "Halte dein System sicher. Installiere Updates für Betriebssystem und Apps sofort und nutze einen aktuellen Virenscanner.",
      },
      {
        id: "05",
        title: "E-Mail-Sicherheit",
        description: "Vorsicht bei Anhängen und Links. Öffne nichts von unbekannten Absendern und achte auf ungewöhnliche Formulierungen.",
      },
      {
        id: "06",
        title: "Mobilgeräte & Datenträger",
        description: "Sichere deine Hardware. Nutze PINs/Biometrie für Smartphones und Tablets. Verschlüssele USB-Sticks und externe Festplatten.",
      },
      {
        id: "07",
        title: "Datenverluste",
        description: "Backup ist Pflicht. Speichere wichtige Daten redundant und nutze die bereitgestellten Cloud-Speicher der Hochschule.",
      },
      {
        id: "08",
        title: "Schutz von sensiblen Daten",
        description: "Clean Desk Policy: Sperre deinen Bildschirm beim Verlassen des Platzes. Lass keine sensiblen Dokumente offen liegen.",
      },
    ],
  },
  en: {
    title: "Information Security & Data Protection",
    subtitle: "The 8 golden rules for safely handling data and systems at IU.",
    rule: "Rule",
    reportIncident: "Report a security incident?",
    reportIncidentDesc: "If you suspect data loss, phishing, or other security incidents, please contact IT Support or the Data Protection Officer immediately at",
    guidelines: [
      {
        id: "01",
        title: "Social Engineering",
        description: "Be vigilant against manipulation attempts. Don't share confidential information with strangers, even if they seem authoritative or helpful.",
      },
      {
        id: "02",
        title: "Password Theft",
        description: "Protect yourself from phishing. Check senders and links carefully. IU will never ask for your password.",
      },
      {
        id: "03",
        title: "Strong Password",
        description: "Use strong passwords: At least 12 characters, mix of upper/lowercase letters, numbers & special characters. Use a unique password for each service.",
      },
      {
        id: "04",
        title: "Antivirus & Updates",
        description: "Keep your system secure. Install updates for OS and apps immediately and use current antivirus software.",
      },
      {
        id: "05",
        title: "Email Security",
        description: "Be careful with attachments and links. Don't open anything from unknown senders and watch for unusual wording.",
      },
      {
        id: "06",
        title: "Mobile Devices & Storage",
        description: "Secure your hardware. Use PINs/biometrics for smartphones and tablets. Encrypt USB drives and external hard drives.",
      },
      {
        id: "07",
        title: "Data Loss",
        description: "Backup is mandatory. Store important data redundantly and use the cloud storage provided by the university.",
      },
      {
        id: "08",
        title: "Protecting Sensitive Data",
        description: "Clean Desk Policy: Lock your screen when leaving your workstation. Don't leave sensitive documents visible.",
      },
    ],
  },
};

const iconMap = [Users, ShieldAlert, Key, RefreshCw, Mail, Smartphone, Database, Lock];

export default function SecurityGuidelines() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  const guidelines = t.guidelines.map((g, index) => ({
    ...g,
    icon: iconMap[index],
    color: "text-iu-blue",
    bgColor: "bg-iu-blue/10",
    borderColor: "border-iu-blue/30",
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm">
            <Shield size={28} />
          </div>
          <h1 className="text-4xl font-black text-foreground tracking-tight">
            {t.title}
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {guidelines.map((item) => (
          <div
            key={item.id}
            className="group relative bg-card/60 backdrop-blur-xl border border-border rounded-[2rem] p-6 hover:border-iu-blue/30 hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            {/* Background Number */}
            <div className="absolute -right-4 -bottom-8 text-9xl font-black text-foreground/5 select-none transition-colors group-hover:text-iu-blue/5">
              {item.id}
            </div>

            <div className="relative z-10">
              {/* Icon & Badge */}
              <div className="flex justify-between items-start mb-6">
                <div
                  className={`p-3 rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm group-hover:scale-110 transition-transform duration-500`}
                >
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="font-black text-iu-blue text-[10px] bg-iu-blue/10 border border-iu-blue/20 px-2 py-1 rounded-lg uppercase tracking-widest">
                  {t.rule} {item.id}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-lg font-black text-foreground mb-3 tracking-tight group-hover:text-iu-blue transition-colors">
                {item.title}
              </h3>
              <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="bg-card/60 backdrop-blur-xl border border-border rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-iu-blue/5 blur-3xl rounded-full group-hover:bg-iu-blue/10 transition-colors" />

        <div className="p-4 bg-iu-blue/10 rounded-2xl text-iu-blue shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-sm">
          <FileWarning className="w-8 h-8" />
        </div>
        <div className="text-center md:text-left relative z-10">
          <h4 className="text-xl font-black text-foreground mb-2 tracking-tight">
            {t.reportIncident}
          </h4>
          <p className="text-muted-foreground font-medium text-base leading-relaxed">
            {t.reportIncidentDesc}{" "}
            <a
              href="mailto:datenschutz@iu.org"
              className="text-iu-blue hover:text-iu-blue/80 transition-colors font-bold hover:underline"
            >
              datenschutz@iu.org
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

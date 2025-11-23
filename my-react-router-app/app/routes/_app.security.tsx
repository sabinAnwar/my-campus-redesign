import { Shield, Lock, Key, RefreshCw, Mail, Smartphone, Database, FileWarning } from "lucide-react";

export default function SecurityGuidelines() {
  const guidelines = [
    {
      id: "01",
      title: "Social Engineering",
      icon: Users,
      description: "Sei wachsam bei Manipulationsversuchen. Gib keine vertraulichen Informationen an Unbekannte weiter, auch wenn diese autoritär oder hilfsbereit wirken.",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/20"
    },
    {
      id: "02",
      title: "Passwort-Diebstahl",
      icon: ShieldAlert,
      description: "Schütze dich vor Phishing. Prüfe Absender und Links genau. Die IU wird dich niemals nach deinem Passwort fragen.",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/20"
    },
    {
      id: "03",
      title: "Sicheres Passwort",
      icon: Key,
      description: "Nutze starke Passwörter: Mindestens 12 Zeichen, Mix aus Groß-/Kleinbuchstaben, Zahlen & Sonderzeichen. Verwende für jeden Dienst ein eigenes Passwort.",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/20"
    },
    {
      id: "04",
      title: "Virenschutz & Updates",
      icon: RefreshCw,
      description: "Halte dein System sicher. Installiere Updates für Betriebssystem und Apps sofort und nutze einen aktuellen Virenscanner.",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/20"
    },
    {
      id: "05",
      title: "E-Mail-Sicherheit",
      icon: Mail,
      description: "Vorsicht bei Anhängen und Links. Öffne nichts von unbekannten Absendern und achte auf ungewöhnliche Formulierungen.",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/20"
    },
    {
      id: "06",
      title: "Mobilgeräte & Datenträger",
      icon: Smartphone,
      description: "Sichere deine Hardware. Nutze PINs/Biometrie für Smartphones und Tablets. Verschlüssele USB-Sticks und externe Festplatten.",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/20"
    },
    {
      id: "07",
      title: "Datenverluste",
      icon: Database,
      description: "Backup ist Pflicht. Speichere wichtige Daten redundant und nutze die bereitgestellten Cloud-Speicher der Hochschule.",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/20"
    },
    {
      id: "08",
      title: "Schutz von sensiblen Daten",
      icon: Lock,
      description: "Clean Desk Policy: Sperre deinen Bildschirm beim Verlassen des Platzes. Lass keine sensiblen Dokumente offen liegen.",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/20"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Informationssicherheit & Datenschutz
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-3xl">
          Die 8 goldenen Regeln für den sicheren Umgang mit Daten und Systemen an der IU.
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {guidelines.map((item) => (
          <div 
            key={item.id}
            className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            {/* Background Number */}
            <div className="absolute -right-4 -bottom-8 text-9xl font-black text-slate-100 dark:text-slate-800/50 select-none transition-colors group-hover:text-emerald-50 dark:group-hover:text-emerald-900/10">
              {item.id}
            </div>

            <div className="relative z-10">
              {/* Icon & Badge */}
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${item.bgColor} ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">
                  Regel {item.id}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-6 flex items-start gap-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg shrink-0">
          <FileWarning className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-1">Sicherheitsvorfall melden?</h4>
          <p className="text-slate-600 dark:text-slate-300 text-sm">
            Bei Verdacht auf Datenverlust, Phishing oder andere Sicherheitsvorfälle wende dich bitte umgehend an den IT-Support oder den Datenschutzbeauftragten unter <a href="mailto:datenschutz@iu.org" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">datenschutz@iu.org</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

import { Users, ShieldAlert } from "lucide-react";

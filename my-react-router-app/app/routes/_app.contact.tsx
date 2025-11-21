import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MessageSquare, Clock, AlertCircle, MapPin, Send, CheckCircle2, BookOpen, FileText, Home, Folder, Wrench, HelpCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setFormData({ subject: '', message: '' });
        }, 5000);
      } else {
        const data = await response.json();
        setError(data.error || 'Fehler beim Senden der Nachricht');
      }
    } catch (err) {
      console.error('Contact form error:', err);
      setError('Netzwerkfehler. Bitte versuche es später erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Simple Header like News */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-semibold transition-colors text-sm mb-4 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Zurück zum Dashboard
            </Link>
            <h1 className="text-4xl font-black text-foreground mb-2">Support & Kontakt</h1>
            <p className="text-muted-foreground text-lg">
              Wir helfen dir gerne bei Fragen und Problemen. Unser Team steht dir zur Verfügung.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20">
            <span className="h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse"></span>
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Support verfügbar</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Contact Form */}
          <div className="space-y-6 lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl shadow-xl p-6 md:p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-6 border-b border-border">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-card-foreground">Schreib uns eine Nachricht</h2>
                  <p className="text-muted-foreground text-sm">
                    Deine IU-Anmeldedaten (Name & E-Mail) hängen wir automatisch an.
                  </p>
                </div>
                <div className="px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-sm font-semibold inline-flex items-center gap-2 border border-emerald-200 dark:border-emerald-800 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
                  Durchschn. Antwortzeit: 1h
                </div>
              </div>

              {submitted ? (
                <div className="bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl p-8 text-center animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mb-2">
                    Nachricht gesendet!
                  </h3>
                  <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    Wir melden uns schnellstmöglich bei dir.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-rose-50 dark:bg-rose-950/20 border-2 border-rose-200 dark:border-rose-800 rounded-xl p-4 flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                      <p className="text-rose-700 dark:text-rose-300 font-semibold text-sm">{error}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-card-foreground uppercase tracking-wide">
                      Betreff
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3.5 border border-input bg-background text-foreground rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
                    >
                      <option value="">-- Wähle ein Thema --</option>
                      <option value="studienplan">Studienplan</option>
                      <option value="klausuren">Klausuren</option>
                      <option value="raumbuchung">Raumbuchung</option>
                      <option value="dateien">Dateien & Materialien</option>
                      <option value="technisch">Technische Probleme</option>
                      <option value="sonstiges">Sonstiges</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-card-foreground uppercase tracking-wide">
                      Nachricht
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={8}
                      className="w-full px-4 py-3.5 border border-input bg-background text-foreground rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none transition-all placeholder:text-muted-foreground"
                      placeholder="Beschreibe dein Anliegen ausführlich..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                        Wird gesendet...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Nachricht senden
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Support Hours */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-950/30 rounded-lg">
                    <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-black text-card-foreground">Support-Zeiten</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-background border border-border">
                    <span className="font-bold text-foreground">Montag - Freitag</span>
                    <span className="text-muted-foreground font-semibold">08:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-background border border-border">
                    <span className="font-bold text-foreground">Samstag</span>
                    <span className="text-muted-foreground font-semibold">10:00 - 14:00</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 border border-border">
                    <span className="font-bold text-muted-foreground">Sonntag</span>
                    <span className="text-muted-foreground font-semibold">Geschlossen</span>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-950/20 dark:to-red-950/20 border-2 border-rose-200 dark:border-rose-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-rose-100 dark:bg-rose-900/50 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-rose-900 dark:text-rose-100">Notfall-Kontakt</h3>
                    <p className="text-rose-700 dark:text-rose-300 text-xs font-semibold">
                      Für dringende Fälle (24/7)
                    </p>
                  </div>
                </div>
                <div className="bg-white dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-lg p-4">
                  <p className="text-xs font-bold text-rose-600 dark:text-rose-400 mb-2 uppercase tracking-wide">
                    Notfall-Hotline
                  </p>
                  <a
                    href="tel:+4940999999999"
                    className="text-2xl font-black text-rose-700 dark:text-rose-300 hover:text-rose-600 dark:hover:text-rose-200 transition-colors flex items-center gap-2"
                  >
                    <Phone className="w-6 h-6" />
                    +49 40 999 999 999
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            {/* Contact Methods */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-black text-card-foreground">Direkter Kontakt</h3>
              </div>
              <div className="space-y-4 text-sm">
                <div className="p-4 rounded-xl bg-background border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <p className="font-bold text-foreground">E-Mail</p>
                  </div>
                  <a
                    href="mailto:support@iu-study.org"
                    className="text-primary hover:text-primary/80 font-semibold transition-colors break-all"
                  >
                    support@iu-study.org
                  </a>
                </div>
                <div className="p-4 rounded-xl bg-background border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-primary" />
                    <p className="font-bold text-foreground">Telefon</p>
                  </div>
                  <a
                    href="tel:+4940123456789"
                    className="text-primary hover:text-primary/80 font-semibold transition-colors"
                  >
                    +49 40 1234 5678
                  </a>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <p className="font-bold text-emerald-900 dark:text-emerald-100">WhatsApp</p>
                  </div>
                  <a
                    href="https://wa.me/4940123456789"
                    className="text-emerald-700 dark:text-emerald-300 hover:text-emerald-600 dark:hover:text-emerald-200 font-semibold transition-colors"
                  >
                    +49 40 1234 5678
                  </a>
                </div>
              </div>
            </div>

            {/* FAQ Link */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-black text-blue-900 dark:text-blue-100">Häufige Fragen</h3>
              </div>
              <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
                Viele Antworten findest du direkt im FAQ-Bereich.
              </p>
              <Link
                to="/faq"
                className="inline-flex justify-center items-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl transition-all w-full shadow-lg hover:shadow-xl active:scale-95"
              >
                Zum FAQ →
              </Link>
            </div>

            {/* Campus Locations */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
                <div className="p-2 bg-purple-100 dark:bg-purple-950/30 rounded-lg">
                  <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-black text-card-foreground">Campus-Standorte</h3>
              </div>
              <div className="space-y-4 text-sm">
                <div className="p-4 rounded-xl bg-background border border-border hover:shadow-md transition-all duration-200">
                  <p className="font-bold text-foreground mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400"></span>
                    Hammerbrook
                  </p>
                  <p className="text-muted-foreground">
                    Hammerbrook 1<br />20537 Hamburg
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-background border border-border hover:shadow-md transition-all duration-200">
                  <p className="font-bold text-foreground mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400"></span>
                    Waterloohain
                  </p>
                  <p className="text-muted-foreground">
                    Waterloohain 45<br />20099 Hamburg
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

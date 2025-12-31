import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  AlertCircle,
  MapPin,
  Send,
  CheckCircle2,
  BookOpen,
  FileText,
  Home,
  Folder,
  Wrench,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "~/contexts/LanguageContext";
import { TRANSLATIONS } from "~/constants/contact";

export default function Contact() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/contact/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setFormData({ subject: "", message: "" });
        }, 5000);
      } else {
        const data = await response.json();
        setError(data.error || t.errorGeneric);
      }
    } catch (err) {
      console.error("Contact form error:", err);
      setError(t.errorNetwork);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm">
            <MessageSquare size={28} />
          </div>
          <h1 className="text-4xl font-black text-foreground tracking-tight">
            {t.title}
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Contact Form */}
        <div className="space-y-8 lg:col-span-2">
          <div className="bg-card/60 backdrop-blur-xl border border-border rounded-[2.5rem] shadow-2xl p-10 relative overflow-hidden">
            {/* Hover background effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-iu-blue/5 blur-[100px] rounded-full opacity-100 -mr-32 -mt-32"></div>

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6 pb-6 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm border border-iu-blue/10">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-foreground tracking-tight">
                      {t.writeUs}
                    </h2>
                    <p className="text-sm text-muted-foreground font-medium">
                      {t.autoAttach}
                    </p>
                  </div>
                </div>
                <div className="px-4 py-2 rounded-xl bg-iu-blue/10 text-iu-blue text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2 border border-iu-blue/20 shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-iu-blue animate-pulse" />
                  {t.responseTime}
                </div>
              </div>

              {submitted ? (
                <div className="bg-iu-blue/5 border border-iu-blue/20 rounded-[2rem] p-12 text-center animate-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-iu-blue/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <CheckCircle2 className="w-10 h-10 text-iu-blue" />
                  </div>
                  <h3 className="text-3xl font-bold text-foreground mb-3">
                    {t.sentTitle}
                  </h3>
                  <p className="text-muted-foreground text-lg font-medium">
                    {t.sentBody}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {error && (
                    <div className="bg-iu-red/5 border border-iu-red/20 rounded-2xl p-5 flex items-center gap-4 animate-in slide-in-from-top-2">
                      <AlertCircle className="w-6 h-6 text-iu-red flex-shrink-0" />
                      <p className="text-iu-red font-bold text-sm">{error}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-muted-foreground uppercase tracking-widest pl-1">
                      {t.subject}
                    </label>
                    <div className="relative group">
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full appearance-none px-6 py-4 border border-border bg-background/50 text-foreground rounded-2xl focus:border-iu-blue/50 focus:bg-background outline-none transition-all cursor-pointer shadow-inner text-base font-medium"
                      >
                        <option value="">{t.subjectPlaceholder}</option>
                        <option value="studienplan">
                          {t.subjectOptions.studienplan}
                        </option>
                        <option value="klausuren">
                          {t.subjectOptions.klausuren}
                        </option>
                        <option value="raumbuchung">
                          {t.subjectOptions.raumbuchung}
                        </option>
                        <option value="dateien">
                          {t.subjectOptions.dateien}
                        </option>
                        <option value="technisch">
                          {t.subjectOptions.technisch}
                        </option>
                        <option value="sonstiges">
                          {t.subjectOptions.sonstiges}
                        </option>
                      </select>
                      <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground rotate-90 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-muted-foreground uppercase tracking-widest pl-1">
                      {t.message}
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={8}
                      className="w-full px-6 py-4 border border-border bg-background/50 text-foreground rounded-2xl focus:border-iu-blue/50 focus:bg-background outline-none resize-none transition-all placeholder:text-muted-foreground/30 shadow-inner text-base font-medium"
                      placeholder={t.messagePlaceholder}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-foreground text-background font-bold py-5 px-8 rounded-2xl transition-all shadow-2xl hover:opacity-90 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-6 h-6 border-2 border-background/30 border-t-background rounded-full animate-spin"></div>
                        {t.sending}
                      </>
                    ) : (
                      <>
                        <Send className="w-6 h-6" />
                        {t.send}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Support Hours */}
            <div className="bg-card/60 backdrop-blur-xl border border-border rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group hover:bg-card transition-all duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm border border-iu-blue/10">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-foreground tracking-tight">
                  {t.supportHours}
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-5 rounded-2xl bg-background/50 border border-border shadow-inner group/item hover:border-iu-blue/30 transition-all">
                  <span className="font-bold text-foreground group-hover/item:text-iu-blue transition-colors">
                    {t.monFri}
                  </span>
                  <span className="text-muted-foreground font-bold">
                    08:00 - 18:00
                  </span>
                </div>
                <div className="flex justify-between items-center p-5 rounded-2xl bg-background/50 border border-border shadow-inner group/item hover:border-iu-blue/30 transition-all">
                  <span className="font-bold text-foreground group-hover/item:text-iu-blue transition-colors">
                    {t.sat}
                  </span>
                  <span className="text-muted-foreground font-bold">
                    10:00 - 14:00
                  </span>
                </div>
                <div className="flex justify-between items-center p-5 rounded-2xl bg-muted/30 border border-border shadow-inner opacity-60">
                  <span className="font-bold text-muted-foreground">
                    {t.sun}
                  </span>
                  <span className="text-muted-foreground font-bold">
                    {t.closed}
                  </span>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-iu-red/5 border border-iu-red/20 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group hover:bg-iu-red/10 transition-all duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-iu-red/10 text-iu-red shadow-sm border border-iu-red/20">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-foreground tracking-tight">
                    {t.emergency}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium">
                    {t.emergencyDesc}
                  </p>
                </div>
              </div>
              <div className="bg-card/80 backdrop-blur-md border border-iu-red/20 rounded-3xl p-6 shadow-2xl">
                <p className="text-[10px] font-black text-iu-red mb-3 uppercase tracking-[0.2em]">
                  {t.emergency}
                </p>
                <a
                  href="tel:+4940999999999"
                  className="text-2xl font-bold text-iu-red hover:text-iu-red/80 transition-all flex items-center gap-3"
                >
                  <Phone className="w-6 h-6" />
                  +49 40 999 999 999
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info Sidebar */}
        <div className="space-y-8">
          {/* Contact Methods */}
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
              <div className="group p-6 rounded-3xl bg-background/50 border border-border hover:border-iu-blue/30 hover:bg-card hover:shadow-2xl transition-all duration-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-iu-blue/10 text-iu-blue group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    E-Mail
                  </p>
                </div>
                <a
                  href="mailto:support@iu-study.org"
                  className="text-lg font-bold text-foreground group-hover:text-iu-blue transition-colors break-all"
                >
                  support@iu-study.org
                </a>
              </div>
              <div className="group p-6 rounded-3xl bg-background/50 border border-border hover:border-iu-blue/30 hover:bg-card hover:shadow-2xl transition-all duration-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-iu-blue/10 text-iu-blue group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    Telefon
                  </p>
                </div>
                <a
                  href="tel:+4940123456789"
                  className="text-lg font-bold text-foreground group-hover:text-iu-blue transition-colors"
                >
                  +49 40 1234 5678
                </a>
              </div>
              <div className="group p-6 rounded-3xl bg-iu-blue/5 border border-iu-blue/10 hover:border-iu-blue/30 hover:bg-card hover:shadow-2xl transition-all duration-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-iu-blue/10 text-iu-blue group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    WhatsApp
                  </p>
                </div>
                <a
                  href="https://wa.me/4940123456789"
                  className="text-lg font-bold text-foreground group-hover:text-iu-blue transition-colors"
                >
                  +49 40 1234 5678
                </a>
              </div>
            </div>
          </div>

          {/* FAQ Link */}
          <div className="bg-iu-blue/5 border border-iu-blue/10 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group hover:bg-iu-blue/10 transition-all duration-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm border border-iu-blue/10">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-foreground tracking-tight">
                Häufige Fragen
              </h3>
            </div>
            <p className="text-muted-foreground font-medium mb-8">
              Viele Antworten findest du direkt im FAQ-Bereich.
            </p>
            <Link
              to="/faq"
              className="inline-flex justify-center items-center bg-iu-blue hover:bg-iu-blue/90 text-white font-bold py-5 px-8 rounded-2xl transition-all w-full shadow-xl hover:shadow-iu-blue/20 active:scale-95"
            >
              Zum FAQ <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
          </div>

          {/* Campus Locations */}
          <div className="bg-card/60 backdrop-blur-xl border border-border rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border/50">
              <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm border border-iu-blue/10">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-foreground tracking-tight">
                Campus-Standorte
              </h3>
            </div>
            <div className="space-y-6">
              <div className="group p-6 rounded-3xl bg-background/50 border border-border hover:border-iu-blue/30 hover:bg-card hover:shadow-2xl transition-all duration-500">
                <p className="font-bold text-foreground mb-2 flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-iu-blue shadow-lg shadow-iu-blue/50"></span>
                  Hammerbrook
                </p>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  Hammerbrook 1<br />
                  20537 Hamburg
                </p>
              </div>
              <div className="group p-6 rounded-3xl bg-background/50 border border-border hover:border-iu-blue/30 hover:bg-card hover:shadow-2xl transition-all duration-500">
                <p className="font-bold text-foreground mb-2 flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-iu-blue shadow-lg shadow-iu-blue/50"></span>
                  Waterloohain
                </p>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  Waterloohain 45
                  <br />
                  20099 Hamburg
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

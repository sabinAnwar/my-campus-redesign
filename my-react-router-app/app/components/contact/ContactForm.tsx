import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, ChevronRight } from "lucide-react";

interface ContactFormProps {
  t: any;
  language: string;
}

export function ContactForm({ t, language }: ContactFormProps) {
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
    <div className="bg-card/60 backdrop-blur-xl border border-border sm:rounded-[2.5rem] rounded-2xl shadow-2xl p-6 sm:p-10 relative overflow-hidden">
      {/* Hover background effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-iu-blue/5 blur-[100px] rounded-full opacity-100 -mr-32 -mt-32"></div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6 pb-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-iu-blue/10 dark:bg-iu-blue text-iu-blue dark:text-white shadow-sm border border-iu-blue/10 shrink-0">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                {t.writeUs}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                {t.autoAttach}
              </p>
            </div>
          </div>
          <div className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-iu-blue/10 dark:bg-iu-blue text-iu-blue dark:text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2 border border-iu-blue/20 dark:border-iu-blue shadow-sm w-fit">
            <span className="h-1.5 w-1.5 rounded-full bg-iu-blue dark:bg-white animate-pulse" />
            {t.responseTime}
          </div>
        </div>

        {submitted ? (
          <div className="bg-iu-blue/5 border border-iu-blue/20 sm:rounded-[2rem] rounded-xl p-8 sm:p-12 text-center animate-in zoom-in-95 duration-500">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-iu-blue/10 dark:bg-iu-blue rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-iu-blue dark:text-white" />
            </div>
            <h3 className="text-xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-3">
              {t.sentTitle}
            </h3>
            <p className="text-sm sm:text-lg text-muted-foreground font-medium">
              {t.sentBody}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {error && (
              <div className="bg-iu-red/5 dark:bg-iu-red/20 border border-iu-red/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 animate-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-iu-red dark:text-white flex-shrink-0" />
                <p className="text-iu-red dark:text-white font-bold text-xs sm:text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-2 sm:space-y-3">
              <label className="block text-[10px] sm:text-sm font-bold text-muted-foreground uppercase tracking-widest pl-1">
                {t.subject}
              </label>
              <div className="relative group">
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full appearance-none px-4 sm:px-6 py-3 sm:py-4 border border-border bg-background/50 text-foreground rounded-xl sm:rounded-2xl focus:border-iu-blue/50 focus:bg-background outline-none transition-all cursor-pointer shadow-inner text-sm sm:text-base font-medium"
                >
                  <option value="">{t.subjectPlaceholder}</option>
                  <option value="studienplan">{t.subjectOptions.studienplan}</option>
                  <option value="klausuren">{t.subjectOptions.klausuren}</option>
                  <option value="raumbuchung">{t.subjectOptions.raumbuchung}</option>
                  <option value="dateien">{t.subjectOptions.dateien}</option>
                  <option value="technisch">{t.subjectOptions.technisch}</option>
                  <option value="sonstiges">{t.subjectOptions.sonstiges}</option>
                </select>
                <ChevronRight className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground rotate-90 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <label className="block text-[10px] sm:text-sm font-bold text-muted-foreground uppercase tracking-widest pl-1">
                {t.message}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={language === "de" ? 6 : 8}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 border border-border bg-background/50 text-foreground rounded-xl sm:rounded-2xl focus:border-iu-blue/50 focus:bg-background outline-none resize-none transition-all placeholder:text-muted-foreground/30 shadow-inner text-sm sm:text-base font-medium"
                placeholder={t.messagePlaceholder}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-foreground text-background font-bold py-4 sm:py-5 px-6 sm:px-8 rounded-xl sm:rounded-2xl transition-all shadow-2xl hover:opacity-90 active:scale-95 flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-background/30 border-t-background rounded-full animate-spin"></div>
                  {t.sending}
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 sm:w-6 sm:h-6" />
                  {t.send}
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

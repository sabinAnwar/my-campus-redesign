import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement actual submission logic
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pb-12 transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 dark:from-slate-800 via-blue-900 dark:via-cyan-900 to-slate-900 dark:to-slate-800 text-white px-8 py-8 shadow-xl">
        <div className="container mx-auto">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-blue-200 dark:text-cyan-400 hover:text-white dark:hover:text-cyan-300 mb-4 font-semibold transition-colors"
          >
            ← Zurück zum Dashboard
          </Link>
          <h1 className="text-4xl font-black mb-2">💬 Support & Kontakt</h1>
          <p className="text-slate-200 dark:text-slate-400 text-lg">
            Wir helfen dir gerne bei Fragen und Problemen
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 border-2 border-slate-200 dark:border-slate-700 transition-colors">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
                Schreib uns eine Nachricht
              </h2>

              {submitted ? (
                <div className="bg-green-50 dark:bg-green-950/40 border-2 border-green-300 dark:border-green-900/50 rounded-xl p-8 text-center">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-2xl font-black text-green-700 dark:text-green-400 mb-2">
                    Nachricht gesendet!
                  </h3>
                  <p className="text-green-600 dark:text-green-500 font-semibold">
                    Wir werden uns so schnell wie möglich bei dir melden.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-base font-bold text-slate-900 dark:text-white mb-3">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:border-cyan-600 dark:focus:border-cyan-500 focus:outline-none font-semibold placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
                      placeholder="Dein Name"
                    />
                  </div>

                  <div>
                    <label className="block text-base font-bold text-slate-900 dark:text-white mb-3">
                      E-Mail
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:border-cyan-600 dark:focus:border-cyan-500 focus:outline-none font-semibold placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
                      placeholder="deine.email@iu-study.org"
                    />
                  </div>

                  <div>
                    <label className="block text-base font-bold text-slate-900 dark:text-white mb-3">
                      Betreff
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:border-cyan-600 dark:focus:border-cyan-500 focus:outline-none font-semibold transition-colors"
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

                  <div>
                    <label className="block text-base font-bold text-slate-900 dark:text-white mb-3">
                      Nachricht
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:border-cyan-600 dark:focus:border-cyan-500 focus:outline-none font-semibold resize-none placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
                      placeholder="Beschreibe dein Anliegen..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-600 dark:from-cyan-600 to-blue-600 dark:to-cyan-700 hover:from-cyan-700 dark:hover:from-cyan-700 hover:to-blue-700 dark:hover:to-cyan-800 text-white font-bold py-4 px-6 rounded-lg transition shadow-lg dark:shadow-cyan-500/20 text-lg"
                  >
                    📧 Nachricht senden
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            {/* Support Hours */}
            <div className="bg-gradient-to-br from-cyan-50 dark:from-cyan-950/40 to-blue-50 dark:to-cyan-900/30 rounded-xl p-6 border-2 border-cyan-300 dark:border-cyan-900/50 transition-colors">
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">
                ⏰ Support-Zeiten
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    Montag - Freitag
                  </p>
                  <p className="text-slate-700 dark:text-slate-400">
                    08:00 - 18:00 Uhr
                  </p>
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    Samstag
                  </p>
                  <p className="text-slate-700 dark:text-slate-400">
                    10:00 - 14:00 Uhr
                  </p>
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    Sonntag
                  </p>
                  <p className="text-slate-700 dark:text-slate-400">
                    Geschlossen
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Methods */}
            <div className="bg-gradient-to-br from-purple-50 dark:from-purple-950/40 to-pink-50 dark:to-purple-900/30 rounded-xl p-6 border-2 border-purple-300 dark:border-purple-900/50 transition-colors">
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">
                📞 Direkter Kontakt
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white mb-1">
                    E-Mail
                  </p>
                  <a
                    href="mailto:support@iu-study.org"
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors"
                  >
                    support@iu-study.org
                  </a>
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white mb-1">
                    Telefon
                  </p>
                  <a
                    href="tel:+4940123456789"
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors"
                  >
                    +49 40 1234 5678
                  </a>
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white mb-1">
                    WhatsApp
                  </p>
                  <a
                    href="https://wa.me/4940123456789"
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors"
                  >
                    +49 40 1234 5678
                  </a>
                </div>
              </div>
            </div>

            {/* FAQ Link */}
            <div className="bg-gradient-to-br from-orange-50 dark:from-orange-950/40 to-amber-50 dark:to-orange-900/30 rounded-xl p-6 border-2 border-orange-300 dark:border-orange-900/50 transition-colors">
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">
                ❓ Häufige Fragen
              </h3>
              <p className="text-slate-700 dark:text-slate-400 text-sm mb-4">
                Viele Antworten findest du in unseren FAQs im Dashboard.
              </p>
              <Link
                to="/dashboard"
                className="inline-block bg-gradient-to-r from-orange-600 dark:from-orange-600 to-amber-600 dark:to-orange-700 hover:from-orange-700 dark:hover:from-orange-700 hover:to-amber-700 dark:hover:to-orange-800 text-white font-bold py-3 px-4 rounded-lg transition shadow-lg dark:shadow-orange-500/20 text-sm w-full text-center"
              >
                Zum FAQ →
              </Link>
            </div>

            {/* Campus Locations */}
            <div className="bg-gradient-to-br from-green-50 dark:from-green-950/40 to-emerald-50 dark:to-green-900/30 rounded-xl p-6 border-2 border-green-300 dark:border-green-900/50 transition-colors">
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">
                📍 Campus-Standorte
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    Hammerbrook
                  </p>
                  <p className="text-slate-700 dark:text-slate-400">
                    Hammerbrook 1<br />
                    20537 Hamburg
                  </p>
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    Waterloohain
                  </p>
                  <p className="text-slate-700 dark:text-slate-400">
                    Waterloohain 45
                    <br />
                    20099 Hamburg
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mt-12 bg-gradient-to-r from-red-50 dark:from-red-950/40 to-orange-50 dark:to-red-900/30 rounded-2xl shadow-xl dark:shadow-red-500/20 p-8 border-2 border-red-300 dark:border-red-900/50 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">🚨</span>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Notfall-Kontakt
              </h2>
              <p className="text-slate-700 dark:text-slate-400 font-semibold">
                Bei dringenden Angelegenheiten außerhalb der Geschäftszeiten
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-700 rounded-lg p-4 border-2 border-red-200 dark:border-red-900/50">
            <p className="text-slate-900 dark:text-white font-bold mb-2">
              Notfall-Hotline (24/7)
            </p>
            <a
              href="tel:+4940999999999"
              className="text-2xl font-black text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
            >
              +49 40 999 999 999
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

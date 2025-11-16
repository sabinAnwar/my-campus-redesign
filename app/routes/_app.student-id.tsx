import React, { useRef } from "react";
import { useLoaderData } from "react-router-dom";

import { showSuccessToast, showErrorToast } from "../lib/toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function loader() {
  try {
    const user = {
      id: 1,
      name: "Sabin El Anwar",
      email: "sabin.elanwar@iu-study.org",
      birthday: "2000-02-10",
      studyProgram: "Wirtschaftsinformatik",
      matriculationNumber: "102203036",
      validUntil: "2026-03-31",
    };
    return { user };
  } catch (error) {
    console.error("Error loading user:", error);
    return { user: null };
  }
}

export default function StudentIdPage() {
  const { user } = useLoaderData();
  const frontRef = useRef(null);
  const backRef = useRef(null);

  if (!user) {
    return (
    
        <div className="flex justify-center py-20">
          <div className="bg-red-50 border-l-4 border-red-600 text-red-800 p-6 rounded-lg max-w-md shadow">
            <p className="font-medium text-center">
              Fehler beim Laden der Benutzerdaten.
            </p>
          </div>
        </div>
     
    );
  }

  const handleDownloadPDF = async () => {
    try {
      showSuccessToast("PDF wird erstellt …");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [85.6, 53.98],
      });

      const renderCard = async (ref) => {
        const canvas = await html2canvas(ref.current, {
          scale: 4,
          useCORS: true,
          backgroundColor: null,
        });
        return canvas.toDataURL("image/png");
      };

      const front = await renderCard(frontRef);
      const back = await renderCard(backRef);

      pdf.addImage(front, "PNG", 0, 0, 85.6, 53.98);
      pdf.addPage();
      pdf.addImage(back, "PNG", 0, 0, 85.6, 53.98);

      pdf.save(`Studentenausweis_${user.matriculationNumber}.pdf`);
      showSuccessToast("PDF erfolgreich heruntergeladen!");
    } catch (error) {
      console.error("PDF error:", error);
      showErrorToast("Fehler beim Erstellen der PDF");
    }
  };

  return (
  
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* HEADER */}
          <header className="text-center mb-14">
            <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
              Digitaler Studentenausweis
            </h1>
            <p className="text-lg text-slate-600">
              IU Internationale Hochschule · Offizieller Studierendenausweis
            </p>
          </header>

          {/* CARD DISPLAY */}
          <section className="grid md:grid-cols-2 gap-10 mb-16">
            {/* FRONT */}
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                Vorderseite
              </h2>
              <div
                ref={frontRef}
                className="relative w-full aspect-[85.6/53.98] rounded-2xl overflow-hidden shadow-2xl border border-slate-800/10 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#1e1b4b] text-white p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300"
              >
                {/* Top Section */}
                <div className="flex justify-between items-start">
                  <div className="bg-white rounded-lg px-3 py-1.5 shadow-sm">
                    <span className="text-[#0f172a] font-black text-2xl">
                      iu
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-300 text-right leading-tight">
                    INTERNATIONALE
                    <br />
                    HOCHSCHULE
                    <br />
                    OF APPLIED SCIENCES
                  </div>
                </div>

                {/* Student Info */}
                <div className="mt-3">
                  <h2 className="text-xl font-bold tracking-wide mb-1">
                    {user.name}
                  </h2>
                  <p className="text-sm text-slate-300 mb-4">
                    {user.studyProgram}
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-[11px] mb-4">
                    <div>
                      <p className="text-slate-400 mb-1">Birthday</p>
                      <p className="font-semibold">
                        {new Date(user.birthday).toLocaleDateString("de-DE")}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 mb-1">Matriculation No.</p>
                      <p className="font-semibold">
                        {user.matriculationNumber}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-slate-400 text-[10px]">Valid until</p>
                    <p className="font-semibold text-sm">
                      {new Date(user.validUntil).toLocaleDateString("de-DE")}
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=IU%20Student%20ID"
                      alt="QR"
                      className="rounded-md"
                    />
                    <span className="text-[9px] text-slate-400 mt-1">
                      Scan to verify
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* BACK */}
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                Rückseite
              </h2>
              <div
                ref={backRef}
                className="relative w-full aspect-[85.6/53.98] rounded-2xl overflow-hidden shadow-2xl border border-slate-800/10 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#1e1b4b] text-white p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300"
              >
                <div>
                  <h3 className="text-lg font-bold mb-3">Kontakt & Info</h3>
                  <p className="text-sm leading-relaxed">
                    IU Internationale Hochschule
                    <br />
                    Albert-Proeller-Str. 15–19
                    <br />
                    86675 Buchdorf
                    <br />
                    Germany
                  </p>

                  <div className="mt-4 border-t border-slate-600 pt-3 text-xs text-slate-300">
                    <p>
                      For global benefits, apply for an{" "}
                      <a
                        href="https://www.isic.de"
                        className="text-blue-400 font-semibold hover:text-blue-300"
                        target="_blank"
                        rel="noreferrer"
                      >
                        ISIC Card
                      </a>
                      .
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-slate-400 mb-1">Signature</p>
                    <div className="h-[20px] w-[100px] border-b border-slate-400"></div>
                  </div>
                  <div className="text-right text-[10px] text-slate-400">
                    © {new Date().getFullYear()} IU Internationale Hochschule
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* DOWNLOAD BUTTON */}
          <div className="flex justify-center mb-20">
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Als PDF herunterladen
            </button>
          </div>

          {/* NOTES */}
          {/* NOTES & INFO */}
          <section className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Nutzungshinweise
                </h3>
                <ul className="space-y-3 text-slate-700 text-sm leading-relaxed">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    Nur in Verbindung mit einem Lichtbildausweis gültig
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    Bewahre deinen Ausweis sicher auf
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    Bei Verlust informiere umgehend dein Studienzentrum
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    Berechtigt zu Vergünstigungen (ÖPNV, Kultur, Freizeit)
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-lg p-8 border border-blue-200/50">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  Vorteile & Features
                </h3>
                <ul className="space-y-3 text-slate-700 text-sm leading-relaxed">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                    Weltweit anerkannt als offizieller Studierendenausweis
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                    Zugang zu Studentenrabatten und -angeboten
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                    QR-Code zur einfachen Verifizierung
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                    Immer verfügbar auf allen Ihren Geräten
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
 
  );
}

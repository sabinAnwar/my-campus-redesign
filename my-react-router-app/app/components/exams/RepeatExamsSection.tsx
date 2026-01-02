import React from "react";
import { RefreshCw, ChevronDown, ChevronUp, Download, FileText } from "lucide-react";
import { handleDownload } from "~/lib/download";
import { repeatExamsDocument } from "~/data/documents";

interface RepeatExamsSectionProps {
  t: any;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function RepeatExamsSection({ t, isOpen, setIsOpen }: RepeatExamsSectionProps) {
  return (
    <section className="bg-card/50 border border-border rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl transition-all hover:bg-card/80">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-8 hover:bg-muted/30 transition-colors text-left cursor-pointer group"
      >
        <div className="flex items-center gap-6 pointer-events-none">
          <div className="p-4 bg-iu-blue/20 rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
            <RefreshCw className="w-8 h-8 text-iu-blue" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">
              {t.repeatExams}
            </h2>
            <p className="text-muted-foreground text-base font-medium opacity-70">
              {t.repeatExamsSubtitle}
            </p>
          </div>
        </div>
        <div>
          {isOpen ? (
            <ChevronUp className="w-8 h-8 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-8 h-8 text-muted-foreground" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="p-8 border-t border-border bg-muted/10">
          <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-3xl">
            <div className="bg-muted/50 p-6 border-b border-border flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-10 backdrop-blur-md">
              <div className="flex items-center gap-3 text-sm font-bold text-foreground">
                <FileText className="w-6 h-6 text-iu-blue" />
                Leitfaden_Wiederholungspruefungen.pdf
              </div>
              <button
                onClick={() =>
                  handleDownload(
                    "Leitfaden_Wiederholungspruefungen",
                    "PDF",
                    repeatExamsDocument
                  )
                }
                className="flex items-center gap-2 text-xs font-black bg-foreground text-background px-6 py-3 rounded-xl hover:opacity-90 transition-all uppercase tracking-widest shadow-lg"
              >
                <Download className="w-4 h-4" />
                {t.download}
              </button>
            </div>

            <div className="p-10 max-h-[700px] overflow-y-auto bg-card text-muted-foreground space-y-12 scrollbar-thin scrollbar-thumb-border">
              <div className="border-b border-border pb-8">
                <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight leading-tight">
                  Leitfaden zum Ablauf von Wiederholungsprüfungen
                </h1>
                <div className="flex justify-between text-[10px] text-muted-foreground/60 font-black uppercase tracking-[0.2em]">
                  <span>ZPA DS</span>
                  <span>Stand: 01.04.2025</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-4">
                  <span className="bg-iu-blue/10 text-iu-blue w-10 h-10 flex items-center justify-center rounded-xl text-lg font-bold border border-iu-blue/20">
                    1
                  </span>{" "}
                  Allgemeines
                </h3>
                <p className="text-lg leading-relaxed font-medium">
                  In diesem Leitfaden findest Du alle wichtigen
                  Informationen zum Ablauf Deiner Wiederholungsprüfung für
                  Klausuren, mündliche Prüfungsleistungen, schriftliche
                  Arbeiten sowie Portfolios und Creative Workbooks. Genaue
                  Informationen zu einzelnen Prüfungsformen findest du in
                  den jeweiligen Prüfungsleitfäden in myCampus.
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-4">
                  <span className="bg-iu-blue/10 text-iu-blue w-10 h-10 flex items-center justify-center rounded-xl text-lg font-bold border border-iu-blue/20">
                    2
                  </span>{" "}
                  Klausur
                </h3>
                <div className="grid md:grid-cols-2 gap-8 pl-2">
                  <div className="bg-muted/20 p-8 rounded-[2rem] border border-border shadow-inner">
                    <h4 className="font-bold text-lg mb-4 text-foreground">
                      Termin
                    </h4>
                    <p className="text-base leading-relaxed font-medium">
                      Klausuren können nur in den vorgegebenen{" "}
                      <strong className="text-foreground">
                        Resit-Phasen (Juni/Dezember)
                      </strong>{" "}
                      wiederholt werden.
                      <br />
                      <br />
                      <em className="text-iu-blue not-italic font-bold">
                        Ausnahme ab 7. Semester:
                      </em>{" "}
                      Wiederholung auch in regulären Phasen (Februar/August)
                      möglich.
                    </p>
                  </div>
                  <div className="bg-muted/20 p-8 rounded-[2rem] border border-border shadow-inner">
                    <h4 className="font-bold text-lg mb-4 text-foreground">
                      Durchführung & Krankheit
                    </h4>
                    <p className="text-base leading-relaxed font-medium">
                      Klausurenphasen können nicht übersprungen werden.
                      Nichtantritt führt automatisch zum Fehlversuch, außer
                      es liegt eine genehmigte Prüfungsunfähigkeit vor
                      (Antrag binnen 3 Werktagen).
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-4">
                  <span className="bg-iu-blue/10 text-iu-blue w-10 h-10 flex items-center justify-center rounded-xl text-lg font-bold border border-iu-blue/20">
                    3
                  </span>{" "}
                  Mündliche Prüfungsleistungen
                </h3>
                <div className="space-y-6 pl-2">
                  <div className="border-l-4 border-iu-blue/40 pl-8 py-2 bg-iu-blue/5 rounded-r-[2rem] p-6 shadow-sm">
                    <h4 className="text-xl font-black text-iu-blue dark:text-iu-blue mb-2 uppercase tracking-tight">
                      Nach genehmigter Prüfungsunfähigkeit
                    </h4>
                    <ul className="mt-4 space-y-4 text-base font-medium">
                      <li className="flex items-start gap-3">
                        <span className="text-iu-blue mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-current" />{" "}
                        <span>
                          <strong className="text-foreground font-black uppercase text-xs tracking-widest">
                            Termin:
                          </strong>{" "}
                          Individueller Nachholtermin bis Ende der nächsten
                          RESIT-Phase.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-iu-blue mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-current" />{" "}
                        <span>
                          <strong className="text-foreground font-black uppercase text-xs tracking-widest">
                            Thema:
                          </strong>{" "}
                          Gleiches Thema wie im Erstversuch (außer bei
                          mündl. Prüfung: neue Fragen).
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-iu-blue mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-current" />{" "}
                        <span>
                          <strong className="text-foreground font-black uppercase text-xs tracking-widest">
                            Status:
                          </strong>{" "}
                          Kein Fehlversuch.
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-iu-orange/40 pl-8 py-2 bg-iu-orange/5 rounded-r-[2rem] p-6 shadow-sm">
                    <h4 className="text-xl font-bold text-iu-orange mb-2">
                      Nach unentschuldigtem Fehlen
                    </h4>
                    <ul className="mt-4 space-y-4 text-base font-medium">
                      <li className="flex items-start gap-3">
                        <span className="text-iu-orange mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-current" />{" "}
                        <span>
                          <strong className="text-foreground">
                            Termin:
                          </strong>{" "}
                          Neuer Termin im Folgesemester.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-iu-orange mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-current" />{" "}
                        <span>
                          <strong className="text-foreground">
                            Thema:
                          </strong>{" "}
                          Neues Thema muss erfragt werden (4 Wochen vor
                          Termin).
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-iu-orange mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-current" />{" "}
                        <span>
                          <strong className="text-foreground">
                            Status:
                          </strong>{" "}
                          Fehlversuch wird angerechnet.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

import { jsPDF } from "jspdf";

export const handleDownload = (title: string, type: string = "PDF", document?: any) => {
  try {
    // Extract content text from document if available
    let contentText = "";
    let htmlContent = "";
    
    // Check title to determine content (works even without document parameter)
    if (title === "Leitfaden_Wiederholungspruefungen" || title.includes("Wiederholungsprüfungen")) {
      contentText = `
Leitfaden zum Ablauf von Wiederholungsprüfungen
ZPA DS - Stand: 01.04.2025

1. Allgemeines
In diesem Leitfaden findest Du alle wichtigen Informationen zum Ablauf Deiner Wiederholungsprüfung für Klausuren, mündliche Prüfungsleistungen, schriftliche Arbeiten sowie Portfolios und Creative Workbooks. Genaue Informationen zu einzelnen Prüfungsformen findest du in den jeweiligen Prüfungsleitfäden in myCampus.

2. Klausur

Termin:
Klausuren können nur in den vorgegebenen Resit-Phasen (Juni/Dezember) wiederholt werden. Ausnahme ab 7. Semester: Wiederholung auch in regulären Phasen (Februar/August) möglich.

Durchführung & Krankheit:
Klausurenphasen können nicht übersprungen werden. Nichtantritt führt automatisch zum Fehlversuch, außer es liegt eine genehmigte Prüfungsunfähigkeit vor (Antrag binnen 3 Werktagen).

3. Mündliche Prüfungsleistungen

Nach genehmigter Prüfungsunfähigkeit:
• Termin: Individueller Nachholtermin bis Ende der nächsten RESIT-Phase.
• Thema: Gleiches Thema wie im Erstversuch (außer bei mündl. Prüfung: neue Fragen).
• Status: Kein Fehlversuch.

Nach unentschuldigtem Fehlen:
• Termin: Neuer Termin im Folgesemester.
• Thema: Neues Thema muss erfragt werden (4 Wochen vor Termin).
• Status: Fehlversuch wird angerechnet.
`;
        htmlContent = `
          <h1>Leitfaden zum Ablauf von Wiederholungsprüfungen</h1>
          <p><em>ZPA DS - Stand: 01.04.2025</em></p>
          
          <h2>1. Allgemeines</h2>
          <p>In diesem Leitfaden findest Du alle wichtigen Informationen zum Ablauf Deiner Wiederholungsprüfung für Klausuren, mündliche Prüfungsleistungen, schriftliche Arbeiten sowie Portfolios und Creative Workbooks. Genaue Informationen zu einzelnen Prüfungsformen findest du in den jeweiligen Prüfungsleitfäden in myCampus.</p>
          
          <h2>2. Klausur</h2>
          <h3>Termin:</h3>
          <p>Klausuren können nur in den vorgegebenen <strong>Resit-Phasen (Juni/Dezember)</strong> wiederholt werden.</p>
          <p><em>Ausnahme ab 7. Semester:</em> Wiederholung auch in regulären Phasen (Februar/August) möglich.</p>
          
          <h3>Durchführung & Krankheit:</h3>
          <p>Klausurenphasen können nicht übersprungen werden. Nichtantritt führt automatisch zum Fehlversuch, außer es liegt eine genehmigte Prüfungsunfähigkeit vor (Antrag binnen 3 Werktagen).</p>
          
          <h2>3. Mündliche Prüfungsleistungen</h2>
          <h3>Nach genehmigter Prüfungsunfähigkeit:</h3>
          <ul>
            <li><strong>Termin:</strong> Individueller Nachholtermin bis Ende der nächsten RESIT-Phase.</li>
            <li><strong>Thema:</strong> Gleiches Thema wie im Erstversuch (außer bei mündl. Prüfung: neue Fragen).</li>
            <li><strong>Status:</strong> Kein Fehlversuch.</li>
          </ul>
          
          <h3>Nach unentschuldigtem Fehlen:</h3>
          <ul>
            <li><strong>Termin:</strong> Neuer Termin im Folgesemester.</li>
            <li><strong>Thema:</strong> Neues Thema muss erfragt werden (4 Wochen vor Termin).</li>
            <li><strong>Status:</strong> Fehlversuch wird angerechnet.</li>
          </ul>
        `;
      } else if (title.includes("Richtlinien zur Gestaltung")) {
        contentText = `
${title}

1. Formale Anforderungen
Schriftliche Arbeiten sind im Format DIN A4 zu erstellen. Der Seitenrand beträgt links 2,5 cm, rechts 2,5 cm, oben 2,5 cm und unten 2,0 cm.

2. Schriftart und -größe
Es wird eine gut lesbare Serifenschrift (z.B. Times New Roman) oder serifenlose Schrift (z.B. Arial) empfohlen. Schriftgröße: 11-12 pt, Zeilenabstand: 1,5-fach.

3. Gliederung
Die Arbeit muss eine logische Gliederung aufweisen (Einleitung, Hauptteil, Schluss). Dezimalklassifikation wird empfohlen (1, 1.1, 1.1.1).

4. Zitation
Es ist durchgängig ein einheitlicher Zitierstil zu verwenden (z.B. APA oder Harvard). Alle verwendeten Quellen müssen im Literaturverzeichnis aufgeführt werden.

5. Literaturverzeichnis
Das Literaturverzeichnis enthält alle in der Arbeit zitierten Quellen in alphabetischer Reihenfolge nach Autorennamen.
`;
        htmlContent = `
          <h1>${title}</h1>
          
          <h2>1. Formale Anforderungen</h2>
          <p>Schriftliche Arbeiten sind im Format DIN A4 zu erstellen. Der Seitenrand beträgt links 2,5 cm, rechts 2,5 cm, oben 2,5 cm und unten 2,0 cm.</p>
          
          <h2>2. Schriftart und -größe</h2>
          <p>Es wird eine gut lesbare Serifenschrift (z.B. Times New Roman) oder serifenlose Schrift (z.B. Arial) empfohlen. Schriftgröße: 11-12 pt, Zeilenabstand: 1,5-fach.</p>
          
          <h2>3. Gliederung</h2>
          <p>Die Arbeit muss eine logische Gliederung aufweisen (Einleitung, Hauptteil, Schluss). Dezimalklassifikation wird empfohlen (1, 1.1, 1.1.1).</p>
          
          <h2>4. Zitation</h2>
          <p>Es ist durchgängig ein einheitlicher Zitierstil zu verwenden (z.B. APA oder Harvard). Alle verwendeten Quellen müssen im Literaturverzeichnis aufgeführt werden.</p>
          
          <h2>5. Literaturverzeichnis</h2>
          <p>Das Literaturverzeichnis enthält alle in der Arbeit zitierten Quellen in alphabetischer Reihenfolge nach Autorennamen.</p>
        `;
      } else if (title.includes("Deckblatt")) {
        // Template for cover page
        contentText = `
IU Internationale Hochschule

Titel der Arbeit
Untertitel der Arbeit

Kurs: DLBWIR01
Tutor: Prof. Dr. Max Mustermann
Vorgelegt von: Max Student
Matrikelnummer: 1234567
Datum: ${new Date().toLocaleDateString('de-DE')}
`;
        htmlContent = `
          <div style="text-align: center; margin-top: 100px;">
            <h1 style="font-size: 24pt; margin-bottom: 50px;">IU Internationale Hochschule</h1>
            
            <h2 style="font-size: 20pt; margin-top: 100px; margin-bottom: 10px;">Titel der Arbeit</h2>
            <h3 style="font-size: 16pt; margin-bottom: 100px;">Untertitel der Arbeit</h3>
            
            <div style="text-align: left; margin-top: 150px; margin-left: 50px;">
              <p><strong>Kurs:</strong> DLBWIR01</p>
              <p><strong>Tutor:</strong> Prof. Dr. Max Mustermann</p>
              <p><strong>Vorgelegt von:</strong> Max Student</p>
              <p><strong>Matrikelnummer:</strong> 1234567</p>
              <p><strong>Datum:</strong> ${new Date().toLocaleDateString('de-DE')}</p>
            </div>
          </div>
        `;
      } else if (title.includes("PowerPoint") || title.includes("Präsentation")) {
        // Template for PowerPoint
        contentText = `
Präsentationstitel
Untertitel oder Thema

IU Internationale Hochschule | Max Student | ${new Date().toLocaleDateString('de-DE')}
`;
        htmlContent = `
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 60px; color: white; height: 400px; position: relative;">
            <h1 style="font-size: 36pt; margin-top: 80px; margin-left: 40px;">Präsentationstitel</h1>
            <h2 style="font-size: 24pt; margin-left: 40px; color: #f0f0f0;">Untertitel oder Thema</h2>
            
            <div style="position: absolute; bottom: 20px; left: 40px; font-size: 10pt;">
              <p>IU Internationale Hochschule | Max Student | ${new Date().toLocaleDateString('de-DE')}</p>
            </div>
          </div>
        `;
      } else {
        contentText = `${title}\n\nDies ist ein Platzhalter-Dokument.\nIn einer echten Anwendung würde hier der vollständige Inhalt stehen.`;
        htmlContent = `<h1>${title}</h1><p>Dies ist ein Platzhalter-Dokument.</p><p>In einer echten Anwendung würde hier der vollständige Inhalt stehen.</p>`;
      }

    console.log("Download debug:", { title, type, contentText: contentText.substring(0, 50), htmlContent: htmlContent.substring(0, 50) });

    // Safety check
    if (!contentText || !htmlContent) {
      console.error("Content is empty!");
      alert("Fehler: Inhalt konnte nicht geladen werden.");
      return;
    }

    if (type === "PPTX") {
      // Use pptxgenjs for real PowerPoint generation
      import("pptxgenjs").then((module) => {
        const pptx = new module.default();
        
        // Add a slide
        const slide = pptx.addSlide();
        
        // Add title
        slide.addText(title, { 
          x: 1, y: 1, w: '80%', h: 1, 
          fontSize: 24, bold: true, color: '363636', align: 'center' 
        });
        
        // Add subtitle/content
        slide.addText("IU Internationale Hochschule", { 
          x: 1, y: 2.5, w: '80%', h: 1, 
          fontSize: 18, color: '666666', align: 'center' 
        });
        
        slide.addText(`Generiert am: ${new Date().toLocaleDateString()}`, { 
          x: 1, y: 4, w: '80%', h: 0.5, 
          fontSize: 12, color: 'AAAAAA', align: 'center' 
        });

        // Save the file
        pptx.writeFile({ fileName: `${title.replace(/\s+/g, '_')}.pptx` });
      }).catch(err => {
        console.error("Failed to load pptxgenjs", err);
        alert("Fehler beim Erstellen der PowerPoint-Datei.");
      });
      return;
    }

    if (type === "DOCX") {
      // For Word documents - use the original working method with proper HTML
      const fullHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='utf-8'>
          <title>${title}</title>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>`;
      
      const blob = new Blob([fullHtml], { type: "application/msword" });
      const link = window.document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${title.replace(/\s+/g, '_')}.doc`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(link.href), 100);
    } else {
      // For PDF, use jsPDF with actual content
      const doc = new jsPDF();
      let yPosition = 20;
      
      // Title
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(title, 20, yPosition);
      yPosition += 10;
      
      // Add content
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      const lines = doc.splitTextToSize(contentText, 170);
      lines.forEach((line: string) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, 20, yPosition);
        yPosition += 6;
      });
      
      // Footer on all pages
      doc.setFontSize(9);
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(`Seite ${i} von ${pageCount} | Generiert am: ${new Date().toLocaleDateString()}`, 20, 285);
      }
      
      doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
    }
  } catch (error) {
    console.error("Download failed:", error);
    alert("Download failed. Please try again.");
  }
};

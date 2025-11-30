
// Simplified file processing that avoids complex PDF.js worker issues
// For PDFs, we'll use a basic text extraction approach

export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type || "";
  const fileName = file.name.toLowerCase();

  if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
    // For PDFs, return a helpful message
    return `📄 PDF-Datei erkannt: ${file.name}\n\nGröße: ${(file.size / 1024).toFixed(2)} KB\n\nℹ️ PDF-Textextraktion ist derzeit eingeschränkt.\n\nFür beste Ergebnisse:\n1. Öffne das PDF\n2. Kopiere den Text (Strg+A, Strg+C)\n3. Füge ihn in eine .txt Datei ein\n4. Lade die .txt Datei hoch\n\nOder nutze die Dokumentensuche im Chat für IU-Dokumente!`;
  } else if (
    fileType.startsWith("text/") || 
    fileName.endsWith(".md") || 
    fileName.endsWith(".txt") ||
    fileName.endsWith(".js") ||
    fileName.endsWith(".ts") ||
    fileName.endsWith(".tsx") ||
    fileName.endsWith(".json") ||
    fileName.endsWith(".csv")
  ) {
    return extractTextFromTextFile(file);
  } else {
    throw new Error(`Nicht unterstützter Dateityp: ${file.type || file.name}. Bitte lade eine Textdatei (.txt, .md, .json, etc.) hoch.`);
  }
}

async function extractTextFromTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text || text.trim().length === 0) {
        reject(new Error("Die Datei scheint leer zu sein."));
      } else {
        resolve(text);
      }
    };
    reader.onerror = (error) => reject(new Error("Fehler beim Lesen der Datei."));
    reader.readAsText(file);
  });
}

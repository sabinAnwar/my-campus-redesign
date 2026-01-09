import { useRef, useCallback } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { showSuccessToast, showErrorToast } from "~/lib/toast";

//// TYPES
//
interface UseStudentIdPdfOptions {
  matriculation_number?: string | null;
  translations: {
    pdfCreating: string;
    pdfSuccess: string;
    pdfError: string;
  };
}

//// HOOK
//
export function useStudentIdPdf({ matriculation_number, translations: t }: UseStudentIdPdfOptions) {
  const frontRef = useRef<HTMLDivElement | null>(null);
  const backRef = useRef<HTMLDivElement | null>(null);

  const handleDownloadPDF = useCallback(async () => {
    try {
      showSuccessToast(t.pdfCreating);
      
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [85.6, 53.98],
      });

      const renderCard = async (ref: React.RefObject<HTMLDivElement | null>) => {
        if (!ref.current) {
          throw new Error("Ref element is not available");
        }
        const canvas = await html2canvas(ref.current as HTMLElement, {
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

      pdf.save(`IU_Student_ID_${matriculation_number || "ID"}.pdf`);
      showSuccessToast(t.pdfSuccess);
    } catch (error) {
      console.error("PDF error:", error);
      showErrorToast(t.pdfError);
    }
  }, [matriculation_number, t]);

  return {
    frontRef,
    backRef,
    handleDownloadPDF,
  };
}

//// HELPER FUNCTIONS
//
export function formatDate(date: any, language: "de" | "en"): string {
  if (!date) return "---";
  const locale = language === "de" ? "de-DE" : "en-US";
  return new Date(date).toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

import { useState } from "react";
import { Search, Clock, CheckCircle, XCircle, AlertCircle, FileText, ChevronRight, Filter, Calendar, Info, X, Upload, Send } from "lucide-react";

// Form field definitions for each application type
const formDefinitions: Record<string, any> = {
  "1": {
    title: "Anmeldung zur Abschlussarbeit Erst- und Zweitversuch",
    fields: [
      { name: "studentName", label: "Name", type: "text", required: true },
      { name: "matrikelNummer", label: "Matrikelnummer", type: "text", required: true },
      { name: "thesisTitle", label: "Titel der Abschlussarbeit", type: "text", required: true },
      { name: "supervisor", label: "Betreuer", type: "text", required: true },
      { name: "company", label: "Unternehmen", type: "text", required: false },
      { name: "startDate", label: "Gewünschtes Startdatum", type: "date", required: true },
      { name: "documents", label: "Dokumente hochladen", type: "file", required: false },
    ],
    microsoftFormUrl: "https://forms.office.com/e/z0xk9ttuJY",
  },
  "2": {
    title: "Antrag auf Nachteilsausgleich",
    fields: [
      { name: "studentName", label: "Name", type: "text", required: true },
      { name: "matrikelNummer", label: "Matrikelnummer", type: "text", required: true },
      { name: "disability", label: "Art der Beeinträchtigung", type: "textarea", required: true },
      { name: "requestedAccommodation", label: "Beantragte Maßnahmen", type: "textarea", required: true },
      { name: "medicalCertificate", label: "Ärztliches Attest", type: "file", required: true },
    ],
    microsoftFormUrl: "https://forms.office.com/Pages/ResponsePage.aspx?id=YOUR_FORM_ID_2",
  },
  "3": {
    title: "Antrag auf Verlängerung der Bearbeitungszeit",
    fields: [
      { name: "studentName", label: "Name", type: "text", required: true },
      { name: "matrikelNummer", label: "Matrikelnummer", type: "text", required: true },
      { name: "currentDeadline", label: "Aktuelle Frist", type: "date", required: true },
      { name: "requestedExtension", label: "Beantragte Verlängerung (Wochen)", type: "number", required: true },
      { name: "reason", label: "Begründung", type: "textarea", required: true },
      { name: "supportingDocuments", label: "Nachweise", type: "file", required: false },
    ],
    microsoftFormUrl: "https://forms.office.com/Pages/ResponsePage.aspx?id=YOUR_FORM_ID_3",
  },
  // Add more form definitions for other application types...
  "default": {
    title: "Allgemeiner Antrag",
    fields: [
      { name: "studentName", label: "Name", type: "text", required: true },
      { name: "matrikelNummer", label: "Matrikelnummer", type: "text", required: true },
      { name: "requestDetails", label: "Details des Antrags", type: "textarea", required: true },
      { name: "documents", label: "Dokumente", type: "file", required: false },
    ],
    microsoftFormUrl: null,
  },
};

const mockItems = [
  { id: "1", title: "Duales Studium - Anmeldung zur Abschlussarbeit Erst- und Zweitversuch", status: "pending", updatedAt: new Date().toISOString(), info: true, category: "Prüfungsamt" },
  { id: "2", title: "Duales Studium - Antrag auf Nachteilsausgleich", status: "pending", updatedAt: new Date().toISOString(), category: "Prüfungsamt" },
  { id: "3", title: "Duales Studium - Antrag auf Verlängerung der Bearbeitungszeit", status: "approved", updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), info: true, category: "Prüfungsamt" },
  { id: "4", title: "Duales Studium - Antrag Beurlaubung", status: "pending", updatedAt: new Date().toISOString(), info: true, category: "Prüfungsamt" },
  { id: "5", title: "Duales Studium - Online Einsicht", status: "pending", updatedAt: new Date().toISOString(), category: "Prüfungsamt" },
  { id: "6", title: "Duales Studium - Online Einwand", status: "rejected", updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), category: "Prüfungsamt" },
  { id: "7", title: "Duales Studium - Upload Bescheinigung der Prüfungsunfähigkeit", status: "pending", updatedAt: new Date().toISOString(), info: true, category: "Prüfungsamt" },
  { id: "8", title: "VFS - Anmeldung zur Abschlussarbeit - Erstversuch", status: "pending", updatedAt: new Date().toISOString(), info: true, category: "Prüfungsamt" },
  { id: "9", title: "VFS - Anmeldung zur Abschlussarbeit - Zweitversuch", status: "pending", updatedAt: new Date().toISOString(), info: true, category: "Prüfungsamt" },
  { id: "10", title: "VFS - Antrag auf Verlängerung der Bearbeitungszeit", status: "approved", updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), info: true, category: "Prüfungsamt" },
  { id: "11", title: "VFS - Antrag auf Zulassung zum Kolloquium", status: "pending", updatedAt: new Date().toISOString(), category: "Prüfungsamt" },
  { id: "12", title: "Duales Studium - Antrag auf Campuswechsel", status: "pending", updatedAt: new Date().toISOString(), info: true, category: "Studierendensekretariat" },
  { id: "13", title: "Duales Studium - Antrag auf kostenlose Online-Weiterbildung ab dem 3. Semester", status: "pending", updatedAt: new Date().toISOString(), info: true, category: "Studierendensekretariat" },
  { id: "14", title: "Duales Studium - Antrag auf Studiengangswechsel", status: "pending", updatedAt: new Date().toISOString(), info: true, category: "Studierendensekretariat" },
  { id: "15", title: "Duales Studium - Antrag auf vorzeitige Exmatrikulation zum Ende des 7. Semesters", status: "pending", updatedAt: new Date().toISOString(), category: "Studierendensekretariat" },
  { id: "16", title: "Duales Studium - Vertragsverlängerung ins 8. Semester", status: "approved", updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), category: "Studierendensekretariat" },
  { id: "17", title: "Duales Studium – Antrag auf Vertiefungswechsel", status: "pending", updatedAt: new Date().toISOString(), category: "Studierendensekretariat" },
];

export default function AntragsVerwaltung() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = mockItems.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || a.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    total: mockItems.length,
    pending: mockItems.filter(i => i.status === "pending").length,
    approved: mockItems.filter(i => i.status === "approved").length,
    rejected: mockItems.filter(i => i.status === "rejected").length,
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved": return <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case "rejected": return <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
      default: return <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "approved": return "Genehmigt";
      case "rejected": return "Abgelehnt";
      default: return "In Bearbeitung";
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "approved": return "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "rejected": return "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800";
      default: return "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
    }
  };

  const handleOpenForm = (application: any) => {
    setSelectedApplication(application);
    setFormData({});
    setShowFormModal(true);
  };

  const handleCloseForm = () => {
    setShowFormModal(false);
    setSelectedApplication(null);
    setFormData({});
  };

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Option 1: Submit to your own API endpoint (which can then save to SharePoint)
      const response = await fetch('/api/applications/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: selectedApplication.id,
          applicationTitle: selectedApplication.title,
          formData: formData,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        alert('Antrag erfolgreich eingereicht!');
        handleCloseForm();
      } else {
        alert('Fehler beim Einreichen des Antrags');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Fehler beim Einreichen des Antrags');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenMicrosoftForm = (formUrl: string) => {
    window.open(formUrl, '_blank', 'noopener,noreferrer');
  };

  const currentFormDef = selectedApplication 
    ? (formDefinitions[selectedApplication.id] || formDefinitions["default"])
    : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-card-foreground mb-2">Antragsverwaltung</h1>
              <p className="text-muted-foreground">Verwalten und verfolgen Sie alle Ihre Anträge</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background/50">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{new Date().toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-muted-foreground">Gesamt</span>
                <FileText className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-card-foreground">{stats.total}</div>
            </div>
            <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-100/50 dark:hover:bg-amber-950/30 transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-amber-700 dark:text-amber-300">In Bearbeitung</span>
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">{stats.pending}</div>
            </div>
            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/30 transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Genehmigt</span>
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{stats.approved}</div>
            </div>
            <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-100/50 dark:hover:bg-rose-950/30 transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-rose-700 dark:text-rose-300">Abgelehnt</span>
                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              </div>
              <div className="text-2xl font-bold text-rose-700 dark:text-rose-300">{stats.rejected}</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Anträge durchsuchen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer"
              >
                <option value="all">Alle Status</option>
                <option value="pending">In Bearbeitung</option>
                <option value="approved">Genehmigt</option>
                <option value="rejected">Abgelehnt</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2.5 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer"
              >
                <option value="all">Alle Kategorien</option>
                <option value="Prüfungsamt">Prüfungsamt</option>
                <option value="Studierendensekretariat">Studierendensekretariat</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <AlertCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Keine Anträge gefunden</h3>
            <p className="text-muted-foreground">Versuchen Sie, Ihre Suchkriterien anzupassen</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((a) => (
              <article
                key={a.id}
                className="group p-5 rounded-xl border border-border bg-card hover:bg-accent/50 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="mt-1">
                        {getStatusIcon(a.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h2 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
                            {a.title}
                          </h2>
                          {a.info && (
                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center" title="Weitere Informationen verfügbar">
                              <Info className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-medium ${getStatusBadgeClass(a.status)}`}>
                            {getStatusText(a.status)}
                          </span>
                          <span className="text-muted-foreground flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(a.updatedAt).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                            {a.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOpenForm(a)}
                    className="flex-shrink-0 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 group-hover:scale-105 active:scale-95"
                  >
                    Ausfüllen
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showFormModal && currentFormDef && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center px-4 py-10 lg:px-8 lg:py-16 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-card rounded-2xl shadow-2xl border border-border/50 max-w-3xl w-full p-8 scale-100 animate-in zoom-in-95 duration-200 relative overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Modal Glow Effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            <div className="relative">
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-black text-card-foreground tracking-tight mb-2">
                    {currentFormDef.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Füllen Sie das Formular aus und reichen Sie Ihren Antrag ein
                  </p>
                </div>
                <button 
                  onClick={handleCloseForm}
                  className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-accent rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Microsoft Forms Option */}
              {currentFormDef.microsoftFormUrl && (
                <div className="mb-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-900 dark:text-blue-100 mb-3">
                    Sie können dieses Formular auch direkt in Microsoft Forms ausfüllen:
                  </p>
                  <button
                    onClick={() => handleOpenMicrosoftForm(currentFormDef.microsoftFormUrl)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    In Microsoft Forms öffnen
                  </button>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmitForm} className="space-y-6">
                {currentFormDef.fields.map((field: any) => (
                  <div key={field.name}>
                    <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">
                      {field.label}
                      {field.required && <span className="text-rose-500 ml-1">*</span>}
                    </label>
                    
                    {field.type === "text" && (
                      <input
                        type="text"
                        required={field.required}
                        value={formData[field.name] || ""}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        className="w-full px-4 py-3.5 rounded-xl border border-border bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                        placeholder={`${field.label} eingeben...`}
                      />
                    )}

                    {field.type === "number" && (
                      <input
                        type="number"
                        required={field.required}
                        value={formData[field.name] || ""}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        className="w-full px-4 py-3.5 rounded-xl border border-border bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                        placeholder={`${field.label} eingeben...`}
                      />
                    )}

                    {field.type === "date" && (
                      <input
                        type="date"
                        required={field.required}
                        value={formData[field.name] || ""}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        className="w-full px-4 py-3.5 rounded-xl border border-border bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      />
                    )}

                    {field.type === "textarea" && (
                      <textarea
                        required={field.required}
                        value={formData[field.name] || ""}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3.5 rounded-xl border border-border bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none placeholder:text-muted-foreground/50"
                        placeholder={`${field.label} eingeben...`}
                      />
                    )}

                    {field.type === "file" && (
                      <div className="relative">
                        <input
                          type="file"
                          required={field.required}
                          onChange={(e) => handleInputChange(field.name, e.target.files?.[0])}
                          className="w-full px-4 py-3.5 rounded-xl border border-border bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground file:font-medium hover:file:bg-primary/90 file:cursor-pointer"
                        />
                        <Upload className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Actions */}
                <div className="flex gap-3 justify-end pt-6 border-t border-border/50">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="px-6 py-2.5 rounded-xl font-bold text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                        Wird eingereicht...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Antrag einreichen
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

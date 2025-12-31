import { useState } from "react";
import {
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  ChevronRight,
  Filter,
  Calendar,
  Info,
  X,
  Upload,
  Send,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useLanguage } from "~/contexts/LanguageContext";
import {
  TRANSLATIONS,
  getFormDefinitions,
  MOCK_ITEMS,
} from "~/constants/antragsverwaltung";







export default function AntragsVerwaltung() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formDefinitions = getFormDefinitions(t);
  const currentFormDef = selectedApplication
    ? formDefinitions[selectedApplication.id as keyof typeof formDefinitions] ||
      formDefinitions.default
    : null;

  const filtered = MOCK_ITEMS.filter((a) => {
    const title = t.itemTitles[a.id as keyof typeof t.itemTitles] || a.titleKey;
    const matchesSearch = title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || a.categoryKey === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    total: MOCK_ITEMS.length,
    pending: MOCK_ITEMS.filter((i) => i.status === "pending").length,
    approved: MOCK_ITEMS.filter((i) => i.status === "approved").length,
    rejected: MOCK_ITEMS.filter((i) => i.status === "rejected").length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-iu-green" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-iu-red" />;
      default:
        return <Clock className="w-5 h-5 text-iu-orange" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return t.approved;
      case "rejected":
        return t.rejected;
      default:
        return t.pending;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-iu-blue/10 text-iu-blue dark:text-iu-blue border-iu-blue/20";
      case "rejected":
        return "bg-iu-red/10 text-iu-red border-iu-red/20";
      default:
        return "bg-iu-orange/10 text-iu-orange border-iu-orange/20";
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
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Option 1: Submit to your own API endpoint (which can then save to SharePoint)
      const response = await fetch("/api/applications/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: selectedApplication.id,
          applicationTitle: selectedApplication.title,
          formData: formData,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        alert("Antrag erfolgreich eingereicht!");
        handleCloseForm();
      } else {
        alert("Fehler beim Einreichen des Antrags");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Fehler beim Einreichen des Antrags");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenMicrosoftForm = (formUrl: string) => {
    window.open(formUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm">
                  <FileText size={28} />
                </div>
                <h1 className="text-4xl font-black text-foreground tracking-tight">
                  {t.title}
                </h1>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                {t.subtitle}
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground bg-card/50 backdrop-blur-xl px-4 py-2 rounded-full border border-border transition-all hover:border-iu-blue/30">
              <Calendar size={16} />
              <span>
                {new Date().toLocaleDateString(
                  language === "de" ? "de-DE" : "en-US",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </span>
            </div>
          </div>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              label: t.totalApplications,
              value: stats.total,
              icon: FileText,
              color: "text-blue-500",
              bgColor: "bg-blue-500/10",
              borderColor: "border-blue-500/20",
            },
            {
              label: t.pendingCount,
              value: stats.pending,
              icon: Clock,
              color: "text-amber-500",
              bgColor: "bg-amber-500/10",
              borderColor: "border-amber-500/20",
            },
            {
              label: t.approvedCount,
              value: stats.approved,
              icon: CheckCircle,
              color: "text-iu-blue",
              bgColor: "bg-iu-blue/10",
              borderColor: "border-iu-blue/20",
            },
            {
              label: t.rejectedCount,
              value: stats.rejected,
              icon: XCircle,
              color: "text-rose-500",
              bgColor: "bg-rose-500/10",
              borderColor: "border-rose-500/20",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6 transition-all hover:scale-[1.02] shadow-sm hover:shadow-md duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-xl ${stat.bgColor} ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <span className="text-2xl font-bold text-foreground">
                  {stat.value}
                </span>
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-iu-blue transition-colors" />
            <input
              type="text"
              placeholder={t.search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-card/50 backdrop-blur-xl border border-border rounded-2xl py-3 pl-12 pr-6 text-sm focus:outline-none focus:border-iu-blue/50 focus:ring-4 focus:ring-iu-blue/10 transition-all"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl px-6 py-3 text-sm font-medium text-foreground focus:outline-none focus:border-iu-blue/50 cursor-pointer"
            >
              <option value="all">{t.allStatus}</option>
              <option value="pending">{t.pending}</option>
              <option value="approved">{t.approved}</option>
              <option value="rejected">{t.rejected}</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl px-6 py-3 text-sm font-medium text-foreground focus:outline-none focus:border-iu-blue/50 cursor-pointer"
            >
              <option value="all">{t.allCategories}</option>
              <option value="examOffice">{t.categories.examOffice}</option>
              <option value="studentOffice">
                {t.categories.studentOffice}
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Application List */}
      <div className="max-w-7xl mx-auto pb-24">
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-card/30 backdrop-blur-xl border border-dashed border-border rounded-3xl">
            <AlertCircle className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground">
              {t.noResults}
            </h3>
            <p className="text-muted-foreground mt-2">{t.noResultsHint}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((a) => (
              <div
                key={a.id}
                className="group bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6 hover:border-iu-blue/50 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          a.status === "approved"
                            ? "bg-iu-blue"
                            : a.status === "rejected"
                              ? "bg-rose-500"
                              : "bg-amber-500"
                        }`}
                      />
                      <span className="text-xs font-medium text-muted-foreground">
                        {
                          t.categories[
                            a.categoryKey as keyof typeof t.categories
                          ]
                        }
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-foreground leading-tight group-hover:text-iu-blue transition-colors">
                      {t.itemTitles[a.id as keyof typeof t.itemTitles] ||
                        a.titleKey}
                    </h2>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      a.status === "approved"
                        ? "border-iu-blue/20 text-iu-blue bg-iu-blue/10"
                        : a.status === "rejected"
                          ? "border-rose-500/20 text-rose-500 bg-rose-500/10"
                          : "border-amber-500/20 text-amber-500 bg-amber-500/10"
                    }`}
                  >
                    {getStatusText(a.status)}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/50">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock size={14} />
                    <span>
                      {new Date(a.updatedAt).toLocaleDateString(
                        language === "de" ? "de-DE" : "en-US"
                      )}
                    </span>
                  </div>
                  <button
                    onClick={() => handleOpenForm(a)}
                    className="flex items-center gap-2 text-sm font-bold text-iu-blue hover:text-iu-blue transition-colors"
                  >
                    <span>{t.startApplication}</span>
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showFormModal && currentFormDef && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-card border border-border max-w-2xl w-full shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh] overflow-hidden rounded-[2rem]">
            {/* Modal Header */}
            <div className="p-8 border-b border-border flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-iu-blue font-bold text-xs uppercase tracking-wider">
                  <FileText size={14} />
                  {t.task}
                </div>
                <h3 className="text-2xl font-bold text-foreground tracking-tight">
                  {currentFormDef.title}
                </h3>
              </div>
              <button
                onClick={handleCloseForm}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {currentFormDef.microsoftFormUrl && (
                <div className="mb-10 p-6 bg-iu-blue/5 border border-iu-blue/10 rounded-2xl flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">
                      {language === "de"
                        ? "Microsoft Forms"
                        : "Microsoft Forms"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === "de"
                        ? "Dieses Formular ist auch über Microsoft Forms verfügbar."
                        : "This form is also available via Microsoft Forms."}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleOpenMicrosoftForm(currentFormDef.microsoftFormUrl)
                    }
                    className="px-4 py-2 bg-iu-blue text-white text-xs font-bold rounded-xl hover:bg-iu-blue transition-colors flex items-center gap-2 shrink-0"
                  >
                    <ExternalLink size={14} />
                    {language === "de" ? "Öffnen" : "Open"}
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmitForm} className="space-y-6">
                {currentFormDef.fields.map((field: any) => (
                  <div key={field.name} className="space-y-2">
                    <label className="text-sm font-semibold text-foreground ml-1">
                      {field.label}{" "}
                      {field.required && (
                        <span className="text-rose-500">*</span>
                      )}
                    </label>

                    {field.type === "textarea" ? (
                      <textarea
                        required={field.required}
                        value={formData[field.name] || ""}
                        onChange={(e) =>
                          handleInputChange(field.name, e.target.value)
                        }
                        rows={4}
                        className="w-full bg-muted/30 border border-border rounded-2xl p-4 text-sm focus:outline-none focus:border-iu-blue/50 focus:ring-4 focus:ring-iu-blue/10 transition-all resize-none"
                      />
                    ) : field.type === "file" ? (
                      <div className="relative">
                        <input
                          type="file"
                          required={field.required}
                          onChange={(e) =>
                            handleInputChange(field.name, e.target.files?.[0])
                          }
                          className="w-full opacity-0 absolute inset-0 cursor-pointer z-10"
                        />
                        <div className="w-full bg-muted/30 border border-border border-dashed rounded-2xl p-8 flex flex-col items-center gap-2 hover:bg-muted/50 transition-colors">
                          <Upload className="w-6 h-6 text-muted-foreground" />
                          <span className="text-sm font-medium text-muted-foreground">
                            {t.uploadFile}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <input
                        type={field.type}
                        required={field.required}
                        value={formData[field.name] || ""}
                        onChange={(e) =>
                          handleInputChange(field.name, e.target.value)
                        }
                        className="w-full bg-muted/30 border border-border rounded-2xl p-4 text-sm focus:outline-none focus:border-iu-blue/50 focus:ring-4 focus:ring-iu-blue/10 transition-all"
                      />
                    )}
                  </div>
                ))}

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="flex-1 py-4 text-sm font-bold hover:bg-muted rounded-2xl transition-all"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-4 bg-iu-blue text-white text-sm font-bold rounded-2xl hover:bg-iu-blue transition-all flex items-center justify-center gap-2 shadow-lg shadow-iu-blue/20"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={18} />
                        {t.submitApplication}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

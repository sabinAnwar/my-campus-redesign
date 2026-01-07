import React from "react";
import { useLanguage } from "~/contexts/LanguageContext";
import { TRANSLATIONS } from "~/services/translations/exam-registration";
import { useCourseSelection } from "~/hooks/useCourseSelection";

// Components
import { KlausuranmeldungHeader } from "~/components/klausuranmeldung/KlausuranmeldungHeader";
import { HowItWorksSection } from "~/components/klausuranmeldung/HowItWorksSection";
import { CourseCategoryList } from "~/components/klausuranmeldung/CourseCategoryList";
import { StudentInfoPanel } from "~/components/klausuranmeldung/StudentInfoPanel";
import { SelectionSummary } from "~/components/klausuranmeldung/SelectionSummary";
import { ImportantNote } from "~/components/klausuranmeldung/ImportantNote";

export const loader = async () => null;

export default function Klausuranmeldung() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  const {
    searchQuery,
    setSearchQuery,
    expandedCategories,
    selectedCourses,
    filteredCategories,
    toggleCategory,
    toggleCourse,
    selectedCourseDetails,
    handleGoToAbgaben,
  } = useCourseSelection();


  return (
    <main className="max-w-7xl mx-auto relative z-10 space-y-4 sm:space-y-6">
      <KlausuranmeldungHeader
        t={t}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Left Column: Course Catalog */}
        <div className="lg:col-span-2 space-y-12">
          <HowItWorksSection t={t} />

          <CourseCategoryList
            t={t}
            filteredCategories={filteredCategories}
            expandedCategories={expandedCategories}
            selectedCourses={selectedCourses}
            toggleCategory={toggleCategory}
            toggleCourse={toggleCourse}
          />
        </div>

        {/* Right Column: Selection Summary */}
        <div className="space-y-8">
          <div className="sticky top-32 space-y-8">
            <StudentInfoPanel t={t} />

            <SelectionSummary
              t={t}
              selectedCourseDetails={selectedCourseDetails}
              onGoToApplication={handleGoToAbgaben}
            />

            <ImportantNote t={t} />
          </div>
        </div>
      </div>
    </main>
  );
}

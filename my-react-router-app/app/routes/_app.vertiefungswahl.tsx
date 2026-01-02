import { useLanguage } from "~/contexts/LanguageContext";
import { useSpecialization } from "~/hooks/useSpecialization";

import { TRANSLATIONS, VERTIEFUNGEN } from "~/constants/specialization";
import {
  SuccessToast,
  PageHeader,
  InfoBanner,
  SpecializationCard,
  SpecializationDetails,
  ConfirmationModal,
  getColorClasses,
} from "~/components/specialization";

import type { VertiefungId } from "~/types/specialization";

// ============================================================================
// LOADER
// ============================================================================

export const loader = async () => null;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================


// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Specialization selection page
 * Allows students to choose their study focus (Vertiefung)
 */
export default function Vertiefungswahl() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  const {
    selectedVertiefung,
    setSelectedVertiefung,
    savedChoice,
    confirmModal,
    setConfirmModal,
    showSuccess,
    handleConfirm,
  } = useSpecialization();

  return (
    <div className="min-h-screen relative z-10 py-10">
      {showSuccess && <SuccessToast message={t.successMsg} />}

      <PageHeader
        title={t.title}
        subtitle={t.subtitle}
        savedChoice={savedChoice}
        currentChoiceLabel={t.currentChoice}
      />

      <InfoBanner title={t.infoTitle} text={t.infoText} />

      {/* Specialization Grid */}
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {Object.values(VERTIEFUNGEN).map((vertiefung) => (
          <SpecializationCard
            key={vertiefung.id}
            vertiefung={vertiefung}
            isSelected={selectedVertiefung === vertiefung.id}
            isSaved={savedChoice === vertiefung.id}
            colorClasses={getColorClasses(vertiefung.color)}
            onSelect={() =>
              setSelectedVertiefung(vertiefung.id as VertiefungId)
            }
            labels={{ chosen: t.chosen, courses: t.courses }}
          />
        ))}
      </div>

      {/* Selected Specialization Details */}
      {selectedVertiefung && (
        <SpecializationDetails
          vertiefung={VERTIEFUNGEN[selectedVertiefung]}
          isSaved={savedChoice === selectedVertiefung}
          language={language}
          onConfirm={() => setConfirmModal(true)}
          labels={{
            alreadyChosen: t.alreadyChosen,
            chooseSpecialization: t.chooseSpecialization,
            coursesInSpec: t.coursesInSpec,
            semester: t.semester,
            careerPaths: t.careerPaths,
          }}
        />
      )}

      {/* Confirmation Modal */}
      {confirmModal && selectedVertiefung && (
        <ConfirmationModal
          vertiefung={VERTIEFUNGEN[selectedVertiefung]}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmModal(false)}
          labels={{
            confirmTitle: t.confirmTitle,
            confirmText: t.confirmText,
            confirmText2: t.confirmText2,
            cancel: t.cancel,
            confirm: t.confirm,
          }}
        />
      )}
    </div>
  );
}

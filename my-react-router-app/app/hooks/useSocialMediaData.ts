import { useLanguage } from "~/store/LanguageContext";
import { TRANSLATIONS } from "~/services/translations/social-media";
import { getOfficialChannels, getFacultyChannels } from "~/utils/social-media/channel-data";

export const useSocialMediaData = () => {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  return {
    t,
    officialChannels: getOfficialChannels(t),
    facultyChannels: getFacultyChannels(t),
  };
};
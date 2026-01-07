import { Users, GraduationCap, Globe } from "lucide-react";
import { useLanguage } from "~/contexts/LanguageContext";
import { TRANSLATIONS } from "~/services/translations/social-media";
import {
  getOfficialChannels,
  getFacultyChannels,
} from "~/lib/socialMediaUtils";
import {
  AlumniConnect,
  AlumniDiscounts,
  BrandAmbassador,
  ChannelCard,
  FacultyCard,
} from "~/components/socialmedia";
import { PageHeader, SectionHeader } from "~/components/shared/PageHeader";

export default function SocialMedia() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  const officialChannels = getOfficialChannels(t);
  const facultyChannels = getFacultyChannels(t);

  return (
    <main className="max-w-7xl mx-auto relative z-10 space-y-6 sm:space-y-8">
      {/* Header Section */}
      <div className="animate-in fade-in slide-in-from-top-4 duration-700">
        <PageHeader 
          icon={Users} 
          title={t.title} 
          subtitle={t.subtitle} 
        />
      </div>

      {/* Official Channels Section */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        <SectionHeader
          icon={Globe}
          title={t.officialChannels}
          subtitle={t.officialSubtitle}
        />

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {officialChannels.map((channel) => (
            <ChannelCard key={channel.name} channel={channel} />
          ))}
        </div>
      </section>

      {/* Faculty Channels Section */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
        <div className="rounded-2xl sm:rounded-[2.5rem] md:rounded-[3rem] bg-card/30 backdrop-blur-xl p-6 sm:p-10 md:p-14 lg:p-16 border border-border relative overflow-hidden">
          <div className="absolute -top-16 -right-16 sm:-top-24 sm:-right-24 w-48 h-48 sm:w-64 sm:h-64 bg-iu-purple blur-[80px] rounded-full" />

          <SectionHeader
            icon={GraduationCap}
            title={t.facultyChannels}
            subtitle={t.facultySubtitle}
            iconBg="bg-iu-purple/10 dark:bg-iu-purple"
            iconColor="text-iu-purple dark:text-white"
          />

          <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 relative z-10">
            {facultyChannels.map((channel) => (
              <FacultyCard
                key={channel.title}
                channel={channel}
                toChannelText={t.toChannel}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Alumni Community Section */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
        <SectionHeader
          icon={Users}
          title={t.alumniCommunity}
          subtitle={t.alumniSubtitle}
          iconBg="bg-iu-blue/10 dark:bg-iu-blue"
          iconColor="text-iu-blue dark:text-white"
        />

        <div className="grid gap-6 sm:gap-8 grid-cols-1 lg:grid-cols-2">
          {/* Left Column: Connect & Discounts */}
          <div className="space-y-8">
            <AlumniConnect
              title={t.iuConnect}
              description={t.iuConnectDesc}
              registerText={t.registerNow}
              linkedinText={t.linkedinGroup}
            />

            <AlumniDiscounts
              title={t.alumniDiscounts}
              masterDiscount={t.masterDiscount}
              masterDiscountNote={t.masterDiscountNote}
              trainingDiscount={t.trainingDiscount}
              trainingDiscountNote={t.trainingDiscountNote}
            />
          </div>

          {/* Right Column: Micro Affiliate */}
          <BrandAmbassador
            title={t.brandAmbassador}
            description={t.ambassadorDesc}
            whatAwaitsTitle={t.whatAwaits}
            whatAwaitsDesc={t.whatAwaitsDesc}
            yourProfileTitle={t.yourProfile}
            yourProfileDesc={t.yourProfileDesc}
            interestedText={t.interested}
          />
        </div>
      </section>
    </main>
  );
}

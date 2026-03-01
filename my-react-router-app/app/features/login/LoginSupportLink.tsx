export const LoginSupportLink = ({ href, icon: Icon, label, isExternal }: any) => {
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-2 bg-gradient-to-br from-slate-100 dark:from-slate-700 to-slate-50 dark:to-slate-600 hover:from-slate-200 dark:hover:from-slate-600 hover:to-slate-100 dark:hover:to-slate-500 text-slate-900 dark:text-white font-semibold rounded-lg transition duration-200 text-xs sm:text-sm border border-slate-200 dark:border-slate-600 hover:border-slate-400 dark:hover:border-iu-blue hover:shadow-lg dark:hover:shadow-iu-blue/20"
    >
      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
      <span>{label}</span>
    </a>
  );
};

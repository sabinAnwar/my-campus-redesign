export const LoginHeader = () => (
  <div className="mb-12 text-center">
    <div className="mb-8 flex justify-center lg:hidden">
      <div className="relative h-24 w-24 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl flex items-center justify-center shadow-lg">
        <span className="text-white font-black text-3xl">IU</span>
      </div>
    </div>
    <div className="inline-block mb-4">
      <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-600 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-300 dark:border-slate-600">STUDENT PORTAL</span>
    </div>
    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-2">Welcome</h1>
    <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base font-semibold mb-2">IU Dual Degree Platform</p>
    <p className="text-slate-500 dark:text-slate-500 text-sm font-medium">Manage marks, applications & modules in one place</p>
  </div>
);

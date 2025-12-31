import { Eye, EyeOff } from "lucide-react";

export const LoginFormInput = ({ id, label, icon: Icon, type, placeholder, showPassword, onTogglePassword }: any) => (
  <div>
    <label htmlFor={id} className="block text-base font-bold text-slate-900 dark:text-white mb-3">{label}</label>
    <div className="relative group">
      <input
        id={id}
        name={id}
        type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
        required
        placeholder={placeholder}
        className="w-full px-5 py-4 pl-16 rounded-lg bg-slate-50 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-base placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-700 focus:border-slate-900 dark:focus:border-iu-blue focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-iu-blue/20 transition duration-300"
      />
      <div className="absolute left-0 top-0 h-full w-14 bg-slate-100 dark:bg-slate-700 rounded-l-lg flex items-center justify-center border-r-2 border-slate-300 dark:border-slate-600 group-focus-within:border-slate-900 dark:group-focus-within:border-iu-blue transition-colors pointer-events-none z-20">
        <Icon className="w-6 h-6 text-slate-700 dark:text-iu-blue" />
      </div>
      {onTogglePassword && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors z-20"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
        </button>
      )}
    </div>
  </div>
);

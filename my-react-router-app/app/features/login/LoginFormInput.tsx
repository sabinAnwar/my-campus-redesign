import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export const LoginFormInput = ({
  id,
  label,
  icon: Icon,
  type,
  placeholder,
  autoComplete,
}: any) => (
  <LoginFormInputInner
    id={id}
    label={label}
    icon={Icon}
    type={type}
    placeholder={placeholder}
    autoComplete={autoComplete}
  />
);

const LoginFormInputInner = ({
  id,
  label,
  icon: Icon,
  type,
  placeholder,
  autoComplete,
}: any) => {
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1"
      >
        {label}
      </label>
      <div className="relative group">
        <input
          id={id}
          name={id}
          type={inputType}
          required
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full px-4 py-2 sm:px-5 sm:py-2 pl-10 sm:pl-12 rounded-lg bg-slate-50 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm sm:text-base placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-700 focus:border-slate-900 dark:focus:border-iu-blue focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-iu-blue/20 transition duration-300 ${isPassword ? "pr-10" : ""}`}
        />
        <div className="absolute left-0 top-0 h-full w-10 sm:w-12 bg-slate-100 dark:bg-slate-700 rounded-l-lg flex items-center justify-center border-r-2 border-slate-300 dark:border-slate-600 group-focus-within:border-slate-900 dark:group-focus-within:border-iu-blue transition-colors pointer-events-none z-20">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700 dark:text-iu-blue" />
        </div>
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

//// TYPES
//
interface FormInputProps {
  /** Input field id and name */
  id: string;
  /** Label text */
  label: string;
  /** Input type (email, password, text) */
  type: "email" | "password" | "text";
  /** Autocomplete attribute */
  autoComplete?: string;
  /** Whether field is required */
  required?: boolean;
}

//// STYLES
//
const STYLES = {
  label: "block text-sm font-medium text-gray-700",
  input: `mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 
          shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`,
} as const;

//// COMPONENT
//
/**
 * Reusable form input with label
 * Provides consistent styling across auth forms
 */
export function FormInput({
  id,
  label,
  type,
  autoComplete,
  required = true,
}: FormInputProps) {
  return (
    <div>
      <label htmlFor={id} className={STYLES.label}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className={STYLES.input}
      />
    </div>
  );
}

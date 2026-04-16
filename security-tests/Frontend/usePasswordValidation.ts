// hooks/usePasswordValidation.ts

// Topic: 1. Password Policy
// Test Cases: TC-SEC-001, TC-SEC-002, TC-SEC-003, TC-SEC-004, TC-SEC-005
// Purpose: To validate password strength on the client-side to improve UX before backend submission.
export function validatePassword(password: string) {
  const errors: string[] = [];
  if (password.length < 8)  errors.push("Must be at least 8 characters");
  if (password.length > 20) errors.push("Must not exceed 20 characters");
  if (!/[A-Z]/.test(password)) errors.push("Must contain at least 1 uppercase letter");
  if (!/\d/.test(password))   errors.push("Must contain at least 1 number");
  return { isValid: errors.length === 0, errors };
}

// components/PasswordInput.tsx
import { validatePassword } from "./usePasswordValidation";

export const PasswordInput: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const { errors } = validatePassword(value);
  
  return (
    <div>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value.length > 0 && errors.map((err, i) => (
        <p key={i} style={{ color: 'red' }}>{err}</p>
      ))}
    </div>
  );
};
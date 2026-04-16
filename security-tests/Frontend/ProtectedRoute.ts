// components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

type Role = "customer" | "staff" | "admin";
const ROLE_LEVELS: Record<Role, number> = { customer: 1, staff: 2, admin: 3 };

interface Props {
  children: React.ReactNode;
  requiredRole: Role;
}

// Topic: 5. API Security
// Test Cases: TC-SEC-012, TC-SEC-013
// Purpose: UI Middleware to prevent unauthorized roles (e.g., Customers) from accessing privileged pages (e.g., Admin/Staff).
export const ProtectedRoute: React.FC<Props> = ({ children, requiredRole }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const userLevel = ROLE_LEVELS[user.role as Role] ?? 0;
  const required  = ROLE_LEVELS[requiredRole] ?? 99;

  if (userLevel < required) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <>{children}</>;
};
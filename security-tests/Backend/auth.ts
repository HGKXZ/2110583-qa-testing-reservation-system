import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Topic: 3. Token Expiration & 5. API Security
// Test Cases: TC-SEC-007, TC-SEC-011
// Purpose: To verify that the request has a valid, non-expired Authorization header.
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = payload; 
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token expired or invalid" });
  }
}

type Role = "customer" | "staff" | "admin";

// Topic: 5. API Security
// Test Cases: TC-SEC-014, TC-SEC-015, TC-SEC-016
// Purpose: To enforce Backend RBAC, ensuring users can only access APIs permitted for their role.
export function authorize(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role as Role;
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: "Forbidden: insufficient role" });
    }
    next();
  };
}
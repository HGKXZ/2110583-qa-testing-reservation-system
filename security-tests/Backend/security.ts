import { Request, Response, NextFunction } from "express";

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,20}$/;

// Topic: 1. Password Policy
// Test Cases: TC-SEC-001, TC-SEC-002, TC-SEC-003, TC-SEC-004, TC-SEC-005
// Purpose: To reject passwords that do not meet the length (8-20) and complexity (1 uppercase, 1 number) criteria at the backend level.
export function validatePasswordPolicy(req: Request, res: Response, next: NextFunction) {
  const { password } = req.body;
  if (!password || !PASSWORD_REGEX.test(password)) {
    return res.status(400).json({
      error: "Invalid password policy",
      message: "Password must be 8-20 chars, contain 1 uppercase & 1 number",
    });
  }
  next();
}

// src/schemas/reservation.schema.ts
import { z } from "zod";

// Topic: 4. Input Validation Security
// Test Cases: TC-SEC-009
// Purpose: To sanitize user input and prevent XSS injections before saving to the database.
export const reservationSchema = z.object({
  specialRequest: z.string().max(200)
    .transform(val => val.replace(/<[^>]*>/g, "").trim())
    .optional(),
});

// src/dto/user.dto.ts
// Topic: 6. Sensitive Data Protection
// Test Cases: TC-SEC-018, TC-SEC-019, TC-SEC-020
// Purpose: To filter out sensitive database fields (password hash, lock status) before returning data to the client.
export function toSafeUser(user: any) {
  const { passwordHash, failedLoginAttempts, isLocked, lockedUntil, ...safe } = user;
  return safe;
}
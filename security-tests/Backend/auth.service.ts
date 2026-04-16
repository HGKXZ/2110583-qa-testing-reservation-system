import bcrypt from "bcrypt";

const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; 

// Topic: 2. Login Attempt Limitation & 6. Sensitive Data Protection
// Test Cases: TC-SEC-006, TC-SEC-017
// Purpose: To verify passwords securely and lock accounts after 5 consecutive failed attempts.
export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  if (user.isLocked) {
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new Error(`Account locked. Try again later.`);
    }
    await prisma.user.update({ where: { email }, data: { isLocked: false, failedLoginAttempts: 0, lockedUntil: null } });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    const newCount = user.failedLoginAttempts + 1;
    const shouldLock = newCount >= MAX_ATTEMPTS;
    await prisma.user.update({ where: { email }, data: {
      failedLoginAttempts: newCount,
      isLocked: shouldLock,
      lockedUntil: shouldLock ? new Date(Date.now() + LOCK_DURATION_MS) : null,
    }});
    if (shouldLock) throw new Error("Account locked after 5 failed attempts");
    throw new Error("Invalid credentials");
  }

  await prisma.user.update({ where: { email }, data: { failedLoginAttempts: 0, isLocked: false, lockedUntil: null } });
  return user;
}
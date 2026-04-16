
// Topic: 7. IDOR Protection
// Test Cases: TC-SEC-021, TC-SEC-022
// Purpose: To verify ownership of a resource. Returns 404 instead of 403 to prevent exposing the existence of other users' data.
export async function getReservationById(reservationId: string, requesterId: string, requesterRole: string) {
  
  // Topic: 4. Input Validation Security
  // Test Cases: TC-SEC-008
  // Purpose: Using Prisma's built-in parameterized queries automatically prevents SQL injection.
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
  });

  if (!reservation) {
    throw new Error("Reservation not found");
  }

  const isPrivileged = ["admin", "staff"].includes(requesterRole);
  if (!isPrivileged && reservation.userId !== requesterId) {
    throw new Error("Reservation not found"); 
  }

  return reservation;
}
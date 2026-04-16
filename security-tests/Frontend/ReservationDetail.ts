// pages/ReservationDetail.tsx
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/axios";

// Topic: 7. IDOR Protection
// Test Cases: TC-SEC-023
// Purpose: To catch 403/404 errors resulting from URL tampering and redirect gracefully without exposing if the resource exists.
export const ReservationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/reservations/${id}`).catch((error) => {
      const status = error.response?.status;
      if (status === 403 || status === 404) {
        navigate("/not-found", { replace: true });
      }
    });
  }, [id, navigate]);

  return <div>Reservation Data...</div>;
};
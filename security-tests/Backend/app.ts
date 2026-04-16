import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

const app = express();
app.use(express.json());

// Topic: 5. API Security
// Test Cases: TC-SEC-010
// Purpose: To prevent DoS and spam bookings by limiting requests to 100 per minute per IP.
export const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
  statusCode: 429,
});

// Topic: 5. API Security
// Test Cases: TC-SEC-010
// Purpose: Strict rate limiting specifically for authentication routes to prevent brute force.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many auth attempts." },
});

// Topic: 5. API Security
// Test Cases: None specified directly, general security practice.
// Purpose: To prevent common web vulnerabilities (XSS, clickjacking) and hide server technology.
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:  ["'self'"], 
      styleSrc:   ["'self'", "'unsafe-inline'"],
      imgSrc:     ["'self'", "data:", "https:"],
    }
  },
  hsts: { maxAge: 31536000, includeSubDomains: true }, 
  noSniff: true,          
  xssFilter: true,        
  hidePoweredBy: true,    
}));

app.use(globalLimiter);
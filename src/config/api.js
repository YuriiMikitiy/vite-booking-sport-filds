/** Backend origin (no trailing slash). Override with VITE_API_URL in .env */
const raw = import.meta.env.VITE_API_URL ?? "http://localhost:5035";
export const API_ORIGIN = String(raw).replace(/\/$/, "");
export const API_BASE = `${API_ORIGIN}/api`;
export const API_BASE_WITHOUT_API = `${API_ORIGIN}`;

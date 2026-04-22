/**
 * Opens Google Maps at coordinates (works in mobile browsers / in-app).
 */
export function buildGoogleMapsUrl(lat, lng) {
  const la = Number(lat);
  const ln = Number(lng);
  if (!Number.isFinite(la) || !Number.isFinite(ln)) {
    return "https://www.google.com/maps";
  }
  return `https://www.google.com/maps?q=${la},${ln}`;
}

/**
 * Для iPhone/iPad — Apple Maps; для інших — Google Maps (відкривається в застосунку карт, якщо є).
 */
export function getNativeMapsUrl(lat, lng, label = "") {
  const la = Number(lat);
  const ln = Number(lng);
  if (!Number.isFinite(la) || !Number.isFinite(ln)) {
    return "https://www.google.com/maps";
  }
  const q = encodeURIComponent(label.trim() || "Location");
  if (typeof navigator !== "undefined") {
    const ua = navigator.userAgent || "";
    if (/iPhone|iPad|iPod/i.test(ua)) {
      return `https://maps.apple.com/?ll=${la},${ln}&q=${q}`;
    }
  }
  return `https://www.google.com/maps/search/?api=1&query=${la},${ln}`;
}

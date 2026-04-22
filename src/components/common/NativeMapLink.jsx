import { useMediaQuery } from "../../hooks/useMediaQuery.js";
import { getNativeMapsUrl } from "../../utils/mapsUrls.js";

/**
 * На мобільних відкриває Google Maps / Apple Maps у застосунку або браузері.
 * На десктопі за замовчуванням лише викликає onDesktopAction (наприклад, центрування Leaflet).
 */
export default function NativeMapLink({
  lat,
  lng,
  label = "",
  className,
  children,
  onDesktopAction,
}) {
  const isMobile = useMediaQuery("(max-width: 900px)");
  const href = getNativeMapsUrl(lat, lng, label);

  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        if (!isMobile && typeof onDesktopAction === "function") {
          e.preventDefault();
          onDesktopAction();
        }
      }}
    >
      {children}
    </a>
  );
}

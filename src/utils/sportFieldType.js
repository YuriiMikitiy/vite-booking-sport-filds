import { sports } from "../components/HomaPage/InputSection/dateTime.js";

/** Мапа типів sport API → дані для UI (без залежності від BookingPage.jsx — уникнення циклічних імпортів). */
export function getCorrectType(type) {
  return sports[type] ?? { name: "Unknown", icon: "" };
}

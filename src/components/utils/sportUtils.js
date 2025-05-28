import { sports } from '../constants/sports';

export const getCorrectType = (type) => {
  return sports[type] ?? { name: "Unknown", icon: "" };
};
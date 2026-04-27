/**
 * Calculates age based on date of birth
 * @param {string|Date} dob - Date of birth
 * @returns {number|null} Age in years
 */
export const calculateAge = (dob) => {
  if (!dob) return null;
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

/**
 * Formats a given number into Indian Rupee (INR)
 * @param {number} val - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (val) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(val || 0);
};

/**
 * Formats a date to a relative string (e.g., "2 HOURS AGO")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatDateRelative = (date) => {
  if (!date) return "";
  const now = new Date();
  const past = new Date(date);
  const diffInMs = now - past;
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) return "JUST NOW";
  if (diffInMinutes < 60)
    return `${diffInMinutes} MINUTE${diffInMinutes > 1 ? "S" : ""} AGO`;
  if (diffInHours < 24)
    return `${diffInHours} HOUR${diffInHours > 1 ? "S" : ""} AGO`;
  if (diffInDays === 1) return "YESTERDAY";
  if (diffInDays < 7)
    return `${diffInDays} DAY${diffInDays > 1 ? "S" : ""} AGO`;

  return past
    .toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();
};

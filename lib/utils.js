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

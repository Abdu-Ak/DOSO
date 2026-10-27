const PHONE_ERROR = "Enter a valid 10-digit phone number";
const AADHAAR_ERROR = "Enter a valid 12-digit Aadhaar number";

export function normalizeEmail(value) {
  if (typeof value !== "string") return undefined;
  const normalized = value.trim().toLowerCase();
  return normalized || undefined;
}

export function normalizeIndianPhone(value) {
  if (value === undefined || value === null) {
    return { value: undefined, error: null };
  }

  const input = String(value).trim();
  if (!input) return { value: undefined, error: null };
  if (/[^0-9+()\-\s]/.test(input)) {
    return { value: undefined, error: PHONE_ERROR };
  }

  let digits = input.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  if (!/^\d{10}$/.test(digits)) {
    return { value: undefined, error: PHONE_ERROR };
  }

  return { value: digits, error: null };
}

export function normalizeAadhaar(value) {
  if (value === undefined || value === null) {
    return { value: undefined, error: null };
  }

  const input = String(value).trim();
  if (!input) return { value: undefined, error: null };
  if (/[^0-9\-\s]/.test(input)) {
    return { value: undefined, error: AADHAAR_ERROR };
  }

  const digits = input.replace(/\D/g, "");
  if (!/^\d{12}$/.test(digits)) {
    return { value: undefined, error: AADHAAR_ERROR };
  }

  return { value: digits, error: null };
}

export async function hasNormalizedPhoneConflict(
  Model,
  normalizedPhone,
  { excludeId, query = {} } = {},
) {
  if (!normalizedPhone) return false;

  const databaseQuery = {
    ...query,
    phone: { $exists: true, $nin: [null, ""] },
  };

  if (excludeId) {
    databaseQuery._id = { $ne: excludeId };
  }

  // Legacy values are intentionally left untouched, so compare their
  // normalized forms in application code as part of the grandfathering plan.
  const records = await Model.find(databaseQuery).select("phone").lean();
  return records.some(
    (record) => normalizeIndianPhone(record.phone).value === normalizedPhone,
  );
}

export async function hasNormalizedAadhaarConflict(
  Model,
  normalizedAadhaar,
  { excludeId, query = {} } = {},
) {
  if (!normalizedAadhaar) return false;

  const databaseQuery = {
    ...query,
    aadhar_number: { $exists: true, $nin: [null, ""] },
  };
  if (excludeId) {
    databaseQuery._id = { $ne: excludeId };
  }

  const records = await Model.find(databaseQuery)
    .select("aadhar_number")
    .lean();
  return records.some(
    (record) =>
      normalizeAadhaar(record.aadhar_number).value === normalizedAadhaar,
  );
}

export function getDuplicateKeyField(error) {
  if (error?.code !== 11000) return null;

  if (error.keyPattern) {
    return Object.keys(error.keyPattern)[0] || null;
  }

  if (error.keyValue) {
    return Object.keys(error.keyValue)[0] || null;
  }

  return null;
}

